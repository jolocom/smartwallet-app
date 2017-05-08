import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'

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
  }

  deleteEntry(webId, entryType, entryId) {
    this.http.delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}`)
    this.http
    .delete(`${util.getProfFolderUrl(webId)}/${entryType}${entryId}.acl`)
    // Todo use removeEntryPatch ?
    let statements // Todo fill in real statements for deletion
    this.http.patch(webId, statements)
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
  }

  _genRandomAttrId() {
    return util.randomString(3)
  }
}
