import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import util from 'lib/util'
import HTTPAgent from 'lib/agents/http'

export default class SolidAgent {
  constructor(webId) {
    this.webId = webId
    this.http = new HTTPAgent()
    this.entryType = {
      phone: PRED.phone,
      email: PRED.email
    }
  }

  deleteEntry(type, value) {
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

  setEntry(type, value) {
    // TODO Abstract to rdf helper
    const triples = rdf.graph()
    const webIdUri = rdf.sym(this.webId)
    const rndId = this._genAtrId()
    const bNode = rdf.blankNode(rndId)
    const seeAlsoFileUri =
    `${util.getProfileFolderUri(this.webId)}/${type}${rndId}`
    // TODO METADATA TO LITERALS?
    triples.add(webIdUri, this.entryType[type], bNode)
    triples.add(bNode, PRED.identifier, rdf.lit(rndId))
    triples.add(bNode, PRED.seeAlso, rdf.sym(seeAlsoFileUri))
    return this.http.patch(this.webId, [], triples.statements)
  }

  _genAtrId() {
    return util.randomString(3)
  }
}
