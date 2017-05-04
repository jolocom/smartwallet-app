import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'

const rdfHelper = {
  addEntryPatch(entryFileUrl, webId, entryType, entryId) {
    const triples = rdf.graph()
    const bNode = rdf.blankNode(entryId)

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    // literal metadata?
    triples.add(rdf.sym(webId), typeToPred[entryType], bNode)
    triples.add(bNode, PRED.identifier, rdf.lit(entryId))
    triples.add(bNode, PRED.seeAlso, rdf.sym(entryFileUrl))
    return triples.statements
  },

  removeEntryPatch() {},

  entryFileBody(entryFileUrl, webId, entryValue, entryType) {
    const triples = rdf.graph()

    const typeToPred = {
      phone: PRED.mobile,
      email: PRED.email
    }

    triples.add(rdf.sym(entryFileUrl), PRED.primaryTopic, rdf.sym(webId))
    triples.add(rdf.sym(entryFileUrl), typeToPred[entryType], entryValue)
    return rdf.serialize(undefined, triples, entryFileUrl, 'text/turtle')
  },

  entryAclFileBody(entryFileAclUrl, entryFileUrl, webId) {
    const owner = rdf.sym(`${entryFileAclUrl}#owner`)
    const triples = rdf.graph()
    triples.add(owner, PRED.type, PRED.auth)
    triples.add(owner, PRED.access, rdf.sym(entryFileUrl))
    triples.add(owner, PRED.agent, rdf.sym(webId))
    triples.add(owner, PRED.mode, PRED.read)
    triples.add(owner, PRED.mode, PRED.write)
    triples.add(owner, PRED.mode, PRED.control)
    return rdf.serialize(undefined, triples, entryFileUrl, 'text/turtle')
  }
}

export default class SolidAgent {
  constructor() {
    this.http = new HTTPAgent({proxy: true})
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
    this._setEntry(webId, entryValue, 'email')
  }

  setPhone(webId, entryValue) {
    this._setEntry(webId, entryValue, 'phone')
  }

  _setEntry(webId, entryValue, entryType) {
    const rndId = this._genRandomAttrId()
    const userProfileFolder = util.getProfileFolderUri(webId)
    const entryFileUrl = `${userProfileFolder}/${entryType}${rndId}`
    const body = rdfHelper
    .addEntryPatch(entryFileUrl, webId, entryType, rndId)

    return this.http.patch(webId, [], body)
    .then(this.createEntryFile(webId, entryFileUrl, entryValue, entryType))
  }

  createEntryFile(webId, entryFileUrl, entryValue, entryType) {
    return this._createEntryFileAcl(webId, entryFileUrl).then(() => {
      const entryFileBody = rdfHelper
      .entryFileBody(entryFileUrl, webId, entryValue, entryType)
      return this.http.put(entryFileUrl, entryFileBody)
    })
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
