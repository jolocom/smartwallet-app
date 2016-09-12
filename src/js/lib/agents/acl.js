
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
  // TODO Check here if the user can modify the acl and throw error if not.
  constructor(uri){
    this.uri = uri
    this.g = rdf.graph()
    this.gAgent = new GraphAgent()
    this.predMap = {
      write: rdf.sym('http://www.w3.org/ns/auth/acl#Write'),
      read: rdf.sym('http://www.w3.org/ns/auth/acl#Read'),
      control: rdf.sym('http://www.w3.org/ns/auth/acl#Control')
    }
  }

  fetchInfo() {
    return this.gAgent.fetchTriplesAtUri(this.uri).then((result)=>{
      let {triples} = result
      for (let triple in triples) {
        let {subject, predicate, object} = triples[triple]
        this.g.add(subject,predicate,object)
      }
    }).then(()=>{
      // TODO, shorten once pull request is accepted.
      if(this.g.statementsMatching(undefined, PRED.type, rdf.sym('http://www.w3.org/ns/auth/acl#Authorization')).length === 0)
      {
        // TODO have recovery here
        throw new Error('Link is not an ACL file')
      }
    }) 
  }

  // TODO Figure out if object or string or both
  allow(user, mode){
    if (mode !== 'read' && mode !== 'write') {
      throw new Error('Invalid mode supplied!')
    }
    mode = this.predMap[mode]
    if (this.g.statementsMatching(user, rdf.sym("http://www.w3.org/ns/auth/acl#mode"), mode) > 0){
      return  
    } else {
      this.g.add(rdf.sym(user), rdf.sym("http://www.w3.org/ns/auth/acl#mode"), mode) 
      console.log('added')
    }
  }

  removeAllow(){
  
  }
  
  allowedPermissions(){
  
  } 

  isAllowed(){
  
  }
}

export default AclAgent
