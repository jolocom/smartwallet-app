import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'
import LDPAgent from 'lib/agents/ldp'

// Rdf related helper, should probably be abstracted.
const rdfHelper = {
  addEntryPatch(entryFileUrl, webId, entryId, entryType) {
    const g = rdf.graph()
    const entryNode =
    `${util.getProfFolderUrl(webId)}/card#${entryType}${entryId}`

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email,
      passport: PRED.passport
    }

    g.add(rdf.sym(webId), typeToPred[entryType], rdf.sym(entryNode))
    g.add(rdf.sym(entryNode), PRED.identifier, rdf.lit(entryId))
    g.add(rdf.sym(entryNode), PRED.seeAlso, rdf.sym(entryFileUrl))
    return g.statements
  },

  removeEntryPatch() {},

  entryFileBody(entryFileUrl, webId, entryValue, entryType) {
    const g = rdf.graph()

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    if (entryType === 'phone' || entryType === 'email') {
      g.add(rdf.sym(entryFileUrl), typeToPred[entryType], entryValue)
      g.add(rdf.sym(entryFileUrl), PRED.primaryTopic, rdf.sym(webId))
    } else if (entryType === 'passport') {
      // TODO add all passport file triples
    }
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
    const entryFileUrl =
    `${util.getProfFolderUrl(webId)}/${entryType}${entryId}`
    let toDel = rdfHelper
    .addEntryPatch(entryFileUrl, webId, entryId, entryType)
    return this.http.patch(`${util.getProfFolderUrl(webId)}/card`, toDel)
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}`))
    .then(this.http
      .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}.acl`))
  }

  updateEntry(webId, entryType, entryId, newValue) {
    const entryFileUrl =
    `${util.getProfFolderUrl(webId)}/${entryType}${entryId}`
    let newEntryFileBody =
    rdfHelper.entryFileBody(entryFileUrl, webId, newValue, entryType)
    return this.http.put(entryFileUrl, newEntryFileBody)
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

    profileData.webId = webId
    profileData.contact.email = await this.getExtendedProprietyValue(g, 'email')
    profileData.contact.phone = await this.getExtendedProprietyValue(g, 'phone')
    try {
      profileData.username.value = g
        .statementsMatching(undefined, PRED.fullName, undefined)[0].object.value
    } catch (e) {
      console.warn('No name found')
    }

    return profileData
  }

  async getExtendedProprietyValue(g, property) {
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

    for (let obj in objects) {
      const tmp = await this._expandData(objects[obj], g, pred)
      if (tmp) {
        propertyData.push(tmp)
      }
    }

    return propertyData
  }

  async _expandData(obj, g, pred) {
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
    if (!relevant.length) {
      return
      // Object.assign({}, defaultResponse, {[key]: obj.value})
    }

    const seeAlso = g.statementsMatching(obj, PRED.seeAlso, undefined)[0]
      .object.value
    const id = g.statementsMatching(obj, PRED.identifier, undefined)[0]
      .object.value

    return this.ldp.fetchTriplesAtUri(seeAlso).then(rdfData => {
      if (rdfData.unav) {
        return defaultResponse
      }

      const extG = rdf.graph()
      extG.addAll(rdfData.triples)
      const value = extG.statementsMatching(undefined, pred, undefined)[0]
        .object.value
      return {id, verified: false, [key]: value}
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

  setPassport(webId, passport) {
    if (!webId || !passport) {
      console.error('Invalid arguments')
      return
    }
    return this._setEntry(webId, passport, 'passport')
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
    return util.randomString(5)
  }
}
