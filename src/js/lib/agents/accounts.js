import HTTPAgent from './http.js'
import {proxy} from 'settings'
import $rdf from 'rdflib'
import {PRED} from '../namespaces.js'
import Util from '../util.js'
import {Writer} from '../rdf.js'
import querystring from 'querystring'

class AccountsAgent {
  constructor() {
    this.http = new HTTPAgent;
  }

  register(username, password, email, name) {
    return this.http.post(`${proxy}/register`, querystring.stringify({
      username, password, email, name
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  updateEmail(webId, email) {
    const writer = new Writer()

    if (email) {
      writer.add(
        $rdf.sym(webId), PRED.email, $rdf.sym(`mailto:${email}`)
      )
    }

    return this.http.patch(this.http._proxify(webId), null, writer.all())
  }

  checkLogin(webId) {
    return this.http.patch(`${proxy}/proxy?url=${webId}`)
  }

  login(username, password) {
    return this.http.post(`${proxy}/login`, querystring.stringify({
      username, password
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  logout() {
    return this.http.post(`${proxy}/logout`, null, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  verifyEmail(username, code) {
    return this.http.post(`${proxy}/verifyemail`, querystring.stringify({
      username, code
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  forgotPassword(username) {
    return this.http.post(`${proxy}/forgotpassword`, querystring.stringify({
      username
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  resetPassword(username, code, password) {
    return this.http.post(`${proxy}/resetpassword`, querystring.stringify({
      username, code, password
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  initInbox(webId) {
    return Promise.all([
      this.createConversationsContainer(webId),
      this.createUnreadMessagesContainer(webId)
    ])
  }

  initIndex(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/index/info`
    const msg = 'These files keep track of what was shared with your friends.'
    return this.http.put(this.http._proxify(uri), msg, {
      'Content-type': 'text/turtle',
      'Link': 'http://www.w3.org/ns/ldp#BasicContainer; rel="type"'
    })
  }

  initDisclaimer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/disclaimer`
    return this.http.put(this.http._proxify(uri),
      'Files in this folder are needed for features of the Little-Sister app.',
      {'Content-type': 'text/turtle'}
    )
  }

  // @TODO this name is confusing, because there's already a
  // default notifications inbox provided by solid.
  // Should be named 'conversations'
  createConversationsContainer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/inbox`

    let writer = new Writer()

    writer.add('', PRED.maker, webId)
    writer.add('', PRED.primaryTopic, $rdf.sym('#inbox'))
    writer.add('#inbox', PRED.type, PRED.space)

    return this.http.put(
      this.http._proxify(uri),
      writer.end(),
      {'Content-type': 'text/turtle'}
    ).then(() => {
      return this._writeAcl(uri, webId)
    })
  }

  createUnreadMessagesContainer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/unread-messages`

    let writer = new Writer()

    writer.add('', PRED.maker, webId)
    writer.add('', PRED.primaryTopic, $rdf.sym('#unread-messages'))
    writer.add('#unread-messages', PRED.type, PRED.space)

    return this.http.put(
      this.http._proxify(uri),
      writer.end(),
      {'Content-type': 'text/turtle'}
    ).then(() => {
      return this._writeAcl(uri, webId)
    })
  }

  _writeAcl(uri, webId) {
    let writer = new Writer()
    let ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    let aclUri = `${uri}.acl`

    writer.addTriple($rdf.sym('#owner'), PRED.type, ACL('Authorization'))
    writer.addTriple($rdf.sym('#owner'), ACL('accessTo'), $rdf.sym(uri))
    writer.addTriple($rdf.sym('#owner'), ACL('accessTo'), $rdf.sym(aclUri))
    writer.addTriple($rdf.sym('#owner'), ACL('agent'), $rdf.sym(webId))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Control'))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Read'))
    writer.addTriple($rdf.sym('#owner'), ACL('mode'), ACL('Write'))

    writer.addTriple($rdf.sym('#append'), PRED.type, ACL('Authorization'))
    writer.addTriple($rdf.sym('#append'), ACL('accessTo'), $rdf.sym(uri))
    writer.addTriple($rdf.sym('#append'), ACL('agentClass'), PRED.Agent)
    writer.addTriple($rdf.sym('#append'), ACL('mode'), ACL('Append'))

    return this.http.put(this.http._proxify(aclUri), writer.end(), {
      'Content-Type': 'text/turtle'
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }
}

export default AccountsAgent
