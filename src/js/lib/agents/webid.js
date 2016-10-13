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
  getWebID() {
    return new Promise((resolve, reject) => {
      const webId = localStorage.getItem('jolocom.webId')
      if (!webId) {
        reject(new Error('Not logged in'))
      } else {
        resolve(webId)
      }
    })
  }

  initInbox(webId) {
    return Promise.all(
      this.createConversationsContainer(webId),
      this.createUnreadMessagesContainer(webId)
    )
  }

  // @TODO this name is confusing, because there's already a
  // default notifications inbox provided by solid.
  // Should be named 'conversations'
  createConversationsContainer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/inbox`

    let writer = new Writer()

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

    return this.put(
      Util.uriToProxied(uri),
      {'Content-type': 'text/turtle'},
      writer.end()
    ).then(() => {
      this._writeAcl(uri, webId)
    })
  }

  createUnreadMessagesContainer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/unread-messages`

    return this.put(
      Util.uriToProxied(uri),
      {'Content-type': 'text/turtle'}
    ).then(() => {
      this._writeAcl(uri, webId)
    })
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

    writer.addTriple(rdflib.sym('#append'), PRED.type, ACL('Authorization'))
    writer.addTriple(rdflib.sym('#append'), ACL('accessTo'), rdflib.sym(uri))
    writer.addTriple(rdflib.sym('#append'), ACL('agentClass'), PRED.Agent)
    writer.addTriple(rdflib.sym('#append'), ACL('mode'), ACL('Append'))

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
