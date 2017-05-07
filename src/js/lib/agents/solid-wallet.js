import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'

const rdfHelper = {
  addEntryPatch(entryFileUrl, webId, entryId, entryType) {
    const g = rdf.graph()
    const bNode = rdf.blankNode(entryId)

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    g.add(rdf.sym(webId), typeToPred[entryType], bNode)
    g.add(bNode, PRED.identifier, rdf.lit(entryId))
    g.add(bNode, PRED.seeAlso, rdf.sym(entryFileUrl))
    return g.statements
  },

  removeEntryPatch() {},

  entryFileBody(entryFileUrl, webId, entryValue, entryType) {
    const g = rdf.graph()

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    g.add(rdf.sym(entryFileUrl), typeToPred[entryType], entryValue)
    g.add(rdf.sym(entryFileUrl), PRED.primaryTopic, rdf.sym(webId))

    return rdf.serialize(undefined, g, entryFileUrl, 'text/turtle')
  },

  entryAclFileBody(entryFileAclUrl, entryFileUrl, webId) {
    const owner = rdf.sym(`${entryFileAclUrl}#owner`)
    const g = rdf.graph()

    g.add(owner, PRED.type, PRED.auth)
    g.add(owner, PRED.access, rdf.sym(entryFileUrl))
    g.add(owner, PRED.agent, rdf.sym(webId))
    g.add(owner, PRED.mode, PRED.read)
    g.add(owner, PRED.mode, PRED.write)
    g.add(owner, PRED.mode, PRED.control)

    return rdf.serialize(undefined, g, entryFileUrl, 'text/turtle')
  }
}

export default class SolidAgent {
  constructor() {
    this.http = new HTTPAgent({proxy: true})
    this.ldp = new LDPAgent()
  }

  getUserInformation(webId) {
    if (!webId) {
      throw new Error('Invalid arguments')
    }

    return this.ldp.fetchTriplesAtUri(webId).then((rdfData) => {
      return this._formatAccountInfo(rdfData.triples)
    })
  }

  // TODO Reconsider abstracting this
  async _formatAccountInfo(userTriples) {
    const g = rdf.graph()
    const profileData = {
      webId: '',
      username: {
        value: '',
        verified: false
      },
      contact: {
        phone: [],
        email: []
      },
      Reputation: 0,
      passport: {
        number: null,
        givenName: null,
        familyName: null,
        birthDate: null,
        gender: null,
        street: null,
        streetAndNumber: null,
        city: null,
        zip: null,
        state: null,
        country: null
      }
    }
    g.addAll(userTriples)
    profileData.username.value = g
      .statementsMatching(undefined, PRED.fullName, undefined)[0].object.value

    profileData.contact.email = await this.getExtendedProprietyValue(g, 'email')

    //
    // this.extractEmailInfo(g)

    /*
    this.expandBlankNodes(g
    .statementsMatching(undefined, PRED.email, undefined))
    g.statementsMatching(undefined, PRED.email, undefined).forEach(t => {
      g.statementsMatching(t.object, undefined, undefined).forEach(record => {
        tmp[tmpMap[record.predicate.value]] = record.object.value
      })
    })
    profileData.email = tmp
    */
    return profileData
  }

  async getExtendedProprietyValue(g, property) {
    const propertyData = []
    const propertyToPredMap = {
      email: PRED.email,
      phone: PRED.mobile
    }

    const pred = propertyToPredMap[property]

    if (!pred) {
      throw new Error('Invalid property')
    }

    const objects = g.statementsMatching(undefined, pred, undefined).map(st =>
      st.object
    )

    for (let obj in objects) {
      if (objects[obj].termType !== 'BlankNode') {
        propertyData.push({
          id: null,
          address: objects[obj].value
        })
      } else {
        propertyData.push(await this._expandBNode(objects[obj], g, pred))
      }
    }

    return propertyData
  }

  // Aimed at our bNode / extended node structure.
  // Error Handling on statements matching and fetch.

  async _expandBNode(obj, g, pred) {
    const extUrl =
      g.statementsMatching(obj, PRED.seeAlso, undefined)[0].object.value
    return this.ldp.fetchTriplesAtUri(extUrl).then(rdfData => {
      const extGraph = rdf.graph()
      extGraph.addAll(rdfData.triples)

      return {
        id: g.statementsMatching(obj, PRED.identifier, undefined)[0]
          .object.value,
        address: extGraph.statementsMatching(undefined, pred, undefined)[0]
          .object.value
      }
    })
  }

  extractPhoneInfo() {
  }

  _fetchExtendedFiles(uri) {
    return this.ldp.fetchTriplesAtUri(uri)
    .then(res => res.triples)
  }

  deleteEntry(entryType, value) {
    return new Promise((resolve, reject) => {
      resolve()
    })
  }

  updateEntry(type, value) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 2000)
    })
  }

  setEmail(webId, entryValue) {
    if (!webId || !entryValue) {
      throw new Error('Invalid arguments')
    }
    return this._setEntry(webId, entryValue, 'email')
  }

  setPhone(webId, entryValue) {
    if (!webId || !entryValue) {
      throw new Error('Invalid arguments')
    }
    return this._setEntry(webId, entryValue, 'phone')
  }

  _setEntry(webId, entryValue, entryType) {
    const rndId = this._genRandomAttrId()
    const entryFileUrl = `${util.getProfFolderUrl(webId)}/${entryType}${rndId}`
    const body = rdfHelper
    .addEntryPatch(entryFileUrl, webId, rndId, entryType)

    return this.http.patch(webId, [], body)
    .then(this.createEntryFile(webId, entryFileUrl, entryValue, entryType))
  }

  createEntryFile(webId, entryFileUrl, entryValue, entryType) {
    const entryFileBody = rdfHelper
    .entryFileBody(entryFileUrl, webId, entryValue, entryType)

    return this._createEntryFileAcl(webId, entryFileUrl)
    .then(this.http.put(entryFileUrl, entryFileBody))
  }

  // Move out of class?
  _createEntryFileAcl(webId, entryFileUrl) {
    const entryFileAclUrl = `${entryFileUrl}.acl`
    const entryFileAclBody = rdfHelper
    .entryAclFileBody(entryFileAclUrl, entryFileUrl, webId)
    return this.http.put(entryFileAclUrl, entryFileAclBody)
  }

  _genRandomAttrId() {
    return util.randomString(3)
  }
}
