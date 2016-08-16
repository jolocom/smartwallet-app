import LDPAgent from './ldp.js'
import {endpoint} from 'settings'
import Util from '../util'
import {Writer} from '../rdf'
import {PRED} from '../namespaces.js'
import rdflib from 'rdflib'

// WebID related functions
class WebIDAgent extends LDPAgent {

  // Should this send it to the proxy?
  isFakeIDAvailable(username) {
    return this.head(`${endpoint}/${username}`)
      .then(() => {
        return false
      }).catch(() => {
        return true
      })
  }

  // Gets the webId of the currently loged in user from local storage,
  // maybe this will need to change, doesn't need to be a promise anymore.
  getWebID() {
    return Promise.resolve(localStorage.getItem('jolocom.webId'))
  }

  initInbox(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/inbox`

    return this.put(
      Util.uriToProxied(uri),
      {'Content-type': 'text/turtle'},
      this._inboxTriples(webId)
    ).then(() => {
      this._writeAcl(uri, webId)
    })
  }

  // Converts the input from the forms to RDF data to put into the inbox card
  _inboxTriples(webId) {
    if (!webId) {
      return Promise.reject('Must provide a webId!')
    }

    let writer = new Writer()

    // Please take a look at
    // https://github.com/solid/solid-spec/blob/master/solid-webid-profiles.md#profile-representation-formats
    // For extra info on the structure of a valid webId Profile
    // writer.addTriple(rdflib.sym(''), DC('title'), `Inbox of ${username}`)
    writer.addTriple({
      subject: '',
      predicate: PRED.maker,
      object: webId
    })

    writer.addTriple({
      subject: '',
      predicate: PRED.primaryTopic,
      object: rdflib.sym('#inbox')
    })

    writer.addTriple({
      subject: '#inbox',
      predicate: PRED.type,
      object: PRED.space
    })

    return writer.end()
  }

  _writeAcl(uri, webId) {
    let writer = new Writer()
    let ACL = rdflib.Namespace('http://www.w3.org/ns/auth/acl#')
    let aclUri = `${uri}.acl`

    writer.addTriple(rdflib.sym('#owner'), PRED.type, ACL('Authorization'))
    writer.addTriple(rdflib.sym('#owner'), ACL('accessTo'), rdflib.sym(uri))
    writer.addTriple(rdflib.sym('#owner'), ACL('accessTo'), rdflib.sym(aclUri))
    writer.addTriple(rdflib.sym('#owner'), ACL('agent'), rdflib.sym(webId))
    writer.addTriple(rdflib.sym('#owner'), ACL('mode'), ACL('Control'))
    writer.addTriple(rdflib.sym('#owner'), ACL('mode'), ACL('Read'))
    writer.addTriple(rdflib.sym('#owner'), ACL('mode'), ACL('Write'))

    writer.addTriple(rdflib.sym('#readall'), PRED.type, ACL('Authorization'))
    writer.addTriple(rdflib.sym('#readall'), ACL('accessTo'), rdflib.sym(uri))
    writer.addTriple(rdflib.sym('#readall'), ACL('agentClass'), PRED.Agent)
    writer.addTriple(rdflib.sym('#readall'), ACL('mode'), ACL('Append'))

    return fetch(Util.uriToProxied(aclUri), {
      method: 'PUT',
      credentials: 'include',
      body: writer.end(),
      headers: {
        'Content-Type': 'text/turtle'
      }
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }

}

export default WebIDAgent
