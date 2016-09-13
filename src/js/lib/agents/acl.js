import rdf from 'rdflib'
import GraphAgent from 'lib/agents/graph.js'
import Util from 'lib/util'
import {PRED} from 'lib/namespaces'
import {Writer} from '../rdf.js'

class AclAgent {
  // TODO Add wildcard support.
  // TODO Check here if the user can modify the acl and throw error if not.
  constructor(uri){
    this.aclUri = `${this.uri}.acl`
    this.uri = uri
    this.g = rdf.graph()
    this.gAgent = new GraphAgent()
    this.Writer = new Writer()

    this.predMap = {
      write: PRED.write,
      read: PRED.read,
      control: PRED.control
    }
  }

  /**
   * @summary Hydrates the object. Decided to not put in constructor,
   *          so that there's no async behaviour there. Also tries to
   *          deduce the URI to the acl file corresponding to the file.
   * @return undefined, we want the side effect
   */

  fetchInfo() {
    return Util.getAclUri(this.uri).then((aclUri)=>{
      this.aclUri = aclUri
      return this.gAgent.fetchTriplesAtUri(this.aclUri).then((result)=>{
        let {triples} = result
        for (let triple in triples) {
          let {subject, predicate, object} = triples[triple]
          this.Writer.addTriple(subject,predicate,object)
        }
      }).then(()=>{
        if(this.Writer.g.statementsMatching(undefined, PRED.type, PRED.auth).length === 0)
        {
          throw new Error('Link is not an ACL file')
        }
      }) 
    })
  }

  /**
   * @summary Gives the specified user the specified permissions.
   * @param {string} user - the webid of the user, in case it's a * [wildcard],
   *                        then everyone is granted the specified access.
   * @param {string} mode - permission to do what? [read, write, control]
   * @return undefined, we want the side effect
   */

  allow(user, mode){
    let policyName
    let identifier = PRED.agent
    if (mode !== 'read' && mode !== 'write') {
      throw new Error('Invalid mode supplied!')
    }
    if (user === '*') {
      user = PRED.Agent 
      identifier = PRED.agentClass
    }
    if (typeof user === 'string') {
      user = rdf.sym(user) 
    }
    
    mode = this.predMap[mode]
    // Check if the triple is already present.
    let existing = this.Writer.g.statementsMatching(undefined, identifier, user)

    if (existing.length > 0){
      policyName = existing[0].subject 

      let trip = this.Writer.g.statementsMatching(policyName, PRED.mode, mode )
      // If true, the triple already exists.
      if (trip.length > 0) {
        return  
      // Else, the policy is present but the triple not, so we add the triple.
      } else {
        this.Writer.addTriple(policyName, PRED.mode, mode) 
      }
    // Else this user is not mentioned in the acl file at all so we create a new
    // polic
    } else {
      policyName = rdf.sym(`${this.aclUri}#${Util.randomString(5)}`)
      this.Writer.addTriple(policyName, PRED.type, PRED.auth)
      this.Writer.addTriple(policyName, PRED.access, rdf.sym(this.uri))
      this.Writer.addTriple(policyName, PRED.mode, mode)
      this.Writer.addTriple(policyName, identifier, user)
    }
  }

  /**
   * @sumarry Serializes the new acl file and puts it to the server.
   * @return {promise} - the server response. 
   */
  commit() {
    return fetch(Util.uriToProxied(this.aclUri), {
      method: 'PUT',
      credentials: 'include',
      body: this.Writer.end(),
      headers: {
        'Content-Type': 'text/turtle',
      }
    }).then((res)=>{
      if (!res.ok){
        throw new Error('Error while putting the file', res)  
      } 
    }).catch((e)=>{
      throw new Error(e)  
    }) 
  }

  removeAllow(){
  
  }
  
  allowedPermissions(){
  
  } 

  isAllowed(){
  
  }
}

export default AclAgent
