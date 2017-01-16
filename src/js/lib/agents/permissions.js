import GraphAgent from 'lib/agents/graph'
import {PRED} from 'lib/namespaces'
import Util from 'lib/util'
import rdf from 'rdflib'

export default class PermissionAgent extends GraphAgent {
  // Commit
  // Get Data

  /* @summary Returns the nodes shared with the URI node
   * @param{string} uri - The person we want to know the shared nodes with.
   * return {array | objects} - The shared nodes grouped by node types,
   * each object in the array contains the uri of the node and the granted
   * permission.
   *
   */

  getSharedNodes(uri) {
    // Add some error handling here perhaps.
    if (!uri) {
      throw new Error('No Uri supplied.')
    }

    const indexUri = Util.getIndexUri(uri)

    let sharedNodes = {
      typePerson: [],
      typeImage: [],
      typeDocument: [],
      typeNotDetected: []
    }

    return this.findTriples(
      indexUri, rdf.sym(uri), undefined, undefined)
    .then((graph) => {
      if (graph === -1) {
        throw new Error('Could not access the index file.')
      }
      const filtered = graph.filter(t =>
        t.predicate.uri === PRED.readPermission.uri)
      return Promise.all(filtered.map((t) => {
        return this.resolveNodeType(t.object.uri).then((ans) => {
          sharedNodes[ans].push({
            uri: t.object.uri,
            perm: t.predicate.uri
          })
        })
      })).then(() => {
        return sharedNodes
      })
    }).catch((e) => {
      return {}
    })
  }

  resolveNodeType(uri) {
    let typeMap = {}
    typeMap[PRED.Document.uri] = 'typeDocument'
    typeMap[PRED.Image.uri] = 'typeImage'
    typeMap[PRED.Person.uri] = 'typePerson'
    typeMap[PRED.profileDoc.uri] = 'typePerson'

    return this.findTriples(uri, rdf.sym(uri),
       PRED.type, undefined)
    .then((graph) => {
      if (graph === -1 || graph.length === 0) {
        return 'typeNotDetected'
      }
      return typeMap[graph[0].object.uri]
    })
  }
}
