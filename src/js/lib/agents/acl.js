
/*
 * Fetch triples at uri
 * check if it's an acl file
 * if not try to recover and discover the acl file
 * go on
 */

import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'
import GraphAgent from 'lib/agents/graph.js'

class AclAgent {

  constructor(uri){
    this.g = rdf.graph()
    this.gAgent = new GraphAgent()

    this.gAgent.fetchTriplesAtUri(uri).then((result)=>{
      let {triples} = result
      for (let triple in triples) {
        let {subject, predicate, object} = triples[triple]
        this.g.add(subject,predicate,object)
      }
    }).then(()=>{
      // TODO, shorten once pull request is accepted.
      if(this.g.statementsMatching(undefined, PRED.type, rdf.sym("http://www.w3.org/ns/auth/acl#Authorization")).length === 0)
      {
        // TODO have recovery here
        throw new Error('Link is not an ACL file')
      }
    }) 
  }

  allow(){
  
  }

  removeAllow(){
  
  }
  
  allowedPermissions(){
  
  } 

  isAllowed(){
  
  }
}

export default AclAgent
