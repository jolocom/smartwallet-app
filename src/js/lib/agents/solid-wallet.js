import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'

// Rdf related helper, should probably be abstracted.
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

    this.defaultProfile = {
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
  }

  async getUserInformation(webId) {
    if (!webId) {
      console.error('No webId found')
      return Object.assign(this.defaultProfile)
    }

    return this.ldp.fetchTriplesAtUri(webId).then((rdfData) => {
      if (rdfData.unav) {
        // TODO snackbar
        console.error('User profile card could not be reached')
        return Object.assign(this.defaultProfile)
      }
      return this._formatAccountInfo(webId, rdfData.triples)
    })
  }

  async _formatAccountInfo(webId, userTriples) {
    const g = rdf.graph()
    const profileData = Object.assign({}, this.defaultProfile)

    g.addAll(userTriples)

    profileData.contact.email = await this.getExtendedProprietyValue(g, 'email')
    profileData.contact.phone = await this.getExtendedProprietyValue(g, 'phone')
    profileData.webId = webId
    profileData.username.value = g
      .statementsMatching(undefined, PRED.fullName, undefined)[0].object.value

    return profileData
  }

  async getExtendedProprietyValue(g, property) {
    const propertyData = []
    const propertyToPredMap = {
      email: PRED.email,
      phone: PRED.mobile
    }

    const keyMap = {
      [PRED.mobile.value]: 'number',
      [PRED.email.value]: 'address'
    }

    const pred = propertyToPredMap[property]

    if (!pred || !g) {
      // TODO warn?
      return
    }

    const objects = g.statementsMatching(undefined, pred, undefined).map(st =>
      st.object
    )

    for (let obj in objects) {
      if (objects[obj].termType !== 'BlankNode') {
        propertyData.push({
          id: null,
          [keyMap[pred.value]]: objects[obj].value
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
    const keyMap = {
      [PRED.mobile.value]: 'number',
      [PRED.email.value]: 'address'
    }

    const extGraph = rdf.graph()
    const key = keyMap[pred.value]
    const extUrl = g.statementsMatching(obj, PRED.seeAlso, undefined)[0]
      .object.value

    return this.ldp.fetchTriplesAtUri(extUrl).then(rdfData => {
      // TODO
      if (rdfData.unav) {
        console.warn('BNode unreachable')
        return {id: null, [key]: null}
      }

      extGraph.addAll(rdfData.triples)
      const id = g.statementsMatching(obj, PRED.identifier, undefined)[0]
          .object.value
      const value = extGraph.statementsMatching(undefined, pred, undefined)[0]
          .object.value

      return { id, [key]: value }
    })
  }

  setEmail(webId, entryValue) {
    if (!webId || !entryValue) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, entryValue, 'email')
  }

  setPhone(webId, entryValue) {
    if (!webId || !entryValue) {
      console.error('Invalid arguments')
      return
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
    .catch(e => console.error('Could not patch user file'))
  }

  createEntryFile(webId, entryFileUrl, entryValue, entryType) {
    const entryFileBody = rdfHelper
    .entryFileBody(entryFileUrl, webId, entryValue, entryType)

    return this._createEntryFileAcl(webId, entryFileUrl)
    .then(this.http.put(entryFileUrl, entryFileBody))
    .catch(e => console.error('Could not create entry acl file'))
  }

  // Move out of class?
  _createEntryFileAcl(webId, entryFileUrl) {
    const entryFileAclUrl = `${entryFileUrl}.acl`
    const entryFileAclBody = rdfHelper
    .entryAclFileBody(entryFileAclUrl, entryFileUrl, webId)
    return this.http.put(entryFileAclUrl, entryFileAclBody)
    .catch(e => console.error('Could not create entry file'))
  }

  _genRandomAttrId() {
    return util.randomString(3)
  }
}
