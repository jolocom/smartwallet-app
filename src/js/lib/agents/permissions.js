import graphAgent from 'lib/agents/graph'
import {PRED} from 'lib/namespaces'
import {Parser, Writer} from 'lib/rdf'
import rdf from 'rdflib'

// So we have one index file that contains the log of the relationships.
// it's all triples.
class PermissionAgent {

  getSharedNodes(uri) {
    let parser = new Parser()
    let writer = new Writer()
    let gAgent = new graphAgent()

    let indexUri = 'https://pre.webid.jolocom.de/profile/index'

    gAgent.fetchTriplesAtUri(indexUri).then((graph) => {
      graph.triples.forEach((t)=>{
        writer.addTriple(t) 
      })
      let results =writer.find(rdf.sym(uri), undefined, undefined) 
      results.forEach((t) => {
        console.log(t.object)
      })
    })
  }
}

export default PermissionAgent
