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

  deleteEntry(webId, entryType, entryId) {
    // TODO use removeEntryPatch ?
    let statements // TODO fill in real statements for deletion
    return this.http.patch(`${util.getProfFolderUrl(webId)}/card`, statements)
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}`))
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}.acl`))
  }

  updateEntry(webId, entryType, entryId, newValue) {
    // TODO fill in real statements
    let oldStatements
    let newStatements
    const entryFileUrl =
    `${util.getProfFolderUrl(webId)}/${entryType}${entryId}`
    return this.http.patch(entryFileUrl, oldStatements, newStatements)
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
    const profileData = Object.assign({}, this.defaultProfile)

    const g = rdf.graph()
    g.addAll(userTriples)

    profileData.contact.email = this.getExtendedProprietyValue(g, 'email')
    profileData.contact.phone = this.getExtendedProprietyValue(g, 'phone')
    profileData.webId = webId

    try {
      profileData.username.value = g
        .statementsMatching(undefined, PRED.fullName, undefined)[0].object.value
    } catch (e) {
      console.warn('No name found')
    }

    return profileData
  }

  getExtendedProprietyValue(g, property) {
    const propertyData = []
    const propertyToPredMap = {
      email: PRED.email,
      phone: PRED.mobile
    }

    const pred = propertyToPredMap[property]
    if (!pred || !g) {
      return propertyData
    }

    const objects = g.statementsMatching(undefined, pred, undefined).map(st =>
      st.object
    )

    objects.forEach(obj => {
      propertyData.push(this._expandData(obj, g, pred))
    })

    return propertyData
  }

  // Aimed at our bNode / extended node structure.
  // Error Handling on statements matching and fetch.

  expandData(obj, g, pred) {
    const keyMap = {
      [PRED.mobile.value]: 'number',
      [PRED.email.value]: 'address'
    }

    const key = keyMap[pred.value]

    const defaultResponse = {
      id: null,
      verified: false,
      [key]: null
    }

    const relevant = g.statementsMatching(obj, undefined, undefined)

    if (relevant.length) {
      return defaultResponse
    }

    if (relevant.length > 1) {

    } else {
      return Object.assign({}, defaultResponse, {key: obj.value})
    }

    if (rdfData.unav) {
      console.warn('BNode unreachable')
      return {id: null, verified: false, [key]: null}
    }

    extGraph.addAll(rdfData.triples)
    const id = g.statementsMatching(obj, PRED.identifier, undefined)[0]
        .object.value
    const value = extGraph.statementsMatching(undefined, pred, undefined)[0]
        .object.value

    return { id, verified: false, [key]: value }
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

    return Promise.all([this.http.patch(webId, [], body),
      this.createEntryFile(webId, entryFileUrl, entryValue, entryType)])
  }

  createEntryFile(webId, entryFileUrl, entryValue, entryType) {
    const entryFileBody = rdfHelper
    .entryFileBody(entryFileUrl, webId, entryValue, entryType)

    return Promise.all([this._createEntryFileAcl(webId, entryFileUrl),
      this.http.put(entryFileUrl, entryFileBody)])
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
