import graphAgent from 'lib/agents/graph'
import {PRED} from 'lib/namespaces'
import rdf from 'rdflib'

// So we have one index file that contains the log of the relationships.
// it's all triples.
class PermissionAgent {

  getSharedNodes(uri) {
    // Add some error handling here perhaps.
    if (!uri) {
      return 
    }

    // Find alternative to having this hard coded.
    let indexUri = 'https://pre.webid.jolocom.de/profile/index'
    this.gAgent = new graphAgent()
    // Will contain the list of URIS.
    let toBeResolved = []
    let sharedNodes = {
      typePerson: [],
      typeImage: [],
      typeDocument: []
    }

    this.gAgent.findTriples(indexUri, rdf.sym(uri), undefined, undefined).then((graph)=>{
      graph.forEach((t)=>{
        toBeResolved.push(new Promise ((res, rej)=> {
          this.resolveNodeType(t.object.uri).then((ans) => {
            sharedNodes[ans].push(t.object.uri)
            res()
          })
        }))
      })

      Promise.all(toBeResolved).then(()=>{
        return sharedNodes
      })
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
      let temp = graph[0].object.uri 
      return typeMap[temp]
    })
  }
}

export default PermissionAgent
