import graphAgent from 'lib/agents/graph'
import {PRED} from 'lib/namespaces'
import Util from 'lib/util'
import rdf from 'rdflib'

// So we have one index file that contains the log of the relationships.
// it's all triples.

class PermissionAgent {

  getSharedNodes(uri) {
    // Add some error handling here perhaps.
    if (!uri) {
      throw new Error('No Uri supplied.')
    }

    this.gAgent = new graphAgent()
    let webid = localStorage.getItem('jolocom.webId')

    if (!webid) {
      throw new Error('Logged in user not detected.')
    }
    let indexUri = Util.getIndexUri(webid)

    let sharedNodes = {
      typePerson: [],
      typeImage: [],
      typeDocument: [],
      typeNotDetected: []
    }

    return this.gAgent.findTriples(indexUri, rdf.sym(uri), undefined, undefined).then((graph)=>{
      if (graph === -1) {
        throw new Error('Could not access the index file.')
      }

      return Promise.all(graph.map((t) => {
        return this.resolveNodeType(t.object.uri).then((ans) => {
          sharedNodes[ans].push(t.object.uri)
        }) 
      })).then(()=>{
        return sharedNodes
      })
    }).catch((e)=>{
      console.warn(e)
      return {}
    })
  }

  // TODO TODO Multiple A statements
  // Given a RDF file uri, returns it's type.
  resolveNodeType(uri) {
    let typeMap = {}
    typeMap[PRED.Document.uri] = 'typeDocument'
    typeMap[PRED.Image.uri] = 'typeImage'
    typeMap[PRED.Person.uri] = 'typePerson'
    typeMap[PRED.profileDoc.uri] = 'typePerson'

    return this.gAgent.findTriples(uri, rdf.sym(uri), PRED.type ,undefined).then((graph)=>{
      if (graph === -1) {
        return 'typeNotDetected'
      }
      let temp = graph[0].object.uri 
      return typeMap[temp]
    })
  }
}

export default PermissionAgent
