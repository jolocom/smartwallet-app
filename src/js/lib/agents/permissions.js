import graphAgent from 'lib/agents/graph'
import {PRED} from 'lib/namespaces'
import rdf from 'rdflib'

// So we have one index file that contains the log of the relationships.
// it's all triples.
class PermissionAgent {

  getSharedNodes(uri) {
    this.gAgent = new graphAgent()
    let indexUri = 'https://pre.webid.jolocom.de/profile/index'
    // Will contain the list of URIS.
    let sharedNodes = []
    // Some error handling here perhaps.
    if (!uri) {
      return 
    }

    this.gAgent.findTriples(indexUri, rdf.sym(uri), undefined, undefined).then((graph)=>{
      graph.forEach((t)=>{
        sharedNodes.push(t.object.uri)
      })
      this.resolveNodeType(sharedNodes[0]).then((res) => {
        console.log('Hello!', res)
      })
    })
  }

  // Given a RDF file uri, returns it's type.
  resolveNodeType(uri) {
    return this.gAgent.findTriples(uri, rdf.sym(uri), PRED.type ,undefined).then((graph)=>{
      let temp = graph[0].object.uri 
      alert(temp)
      return temp
    })
  }
}

export default PermissionAgent
