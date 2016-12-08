import HTTPAgent from './http.js'
import {proxy} from 'settings'
import $rdf from 'rdflib'
import {PRED} from '../namespaces.js'
import Util from '../util.js'
import {Writer} from '../rdf.js'

class AccountsAgent extends HTTPAgent {
  register(username, password, email, name) {
    function encodeParams(username, password, email) {
      username = encodeURIComponent(username)
      password = encodeURIComponent(password)
      email = encodeURIComponent(email)

      return `username=${username}&password=${password}&email=${email}`
    }

    return this.post(`${proxy}/register`,
      encodeParams(username, password, email), {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    ).then((account) => {
      const writer = new Writer()

      if (name) {
        writer.add(
          $rdf.sym(account.webid), PRED.givenName, name
        )
      }

      if (email) {
        writer.add(
          $rdf.sym(account.webid), PRED.email, $rdf.sym(`mailto:${email}`)
        )
      }

      this.patch(this._proxify(account.webid), null, writer.all())

      return account
    })
  }

  checkLogin(webId) {
    return this.patch(`${proxy}/proxy?url=${webId}`)
  }

  login(username, password) {
    username = encodeURIComponent(username)
    password = encodeURIComponent(password)

    const params = `username=${username}&password=${password}`
    return this.post(`${proxy}/login`, params, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  logout() {
    return this.post(`${proxy}/logout`, null, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  forgotPassword(username) {
    let user = encodeURIComponent(username)

    return this.post(`${proxy}/forgotpassword`, `username=${user}`, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  resetPassword(username, token, password) {
    username = encodeURIComponent(username)
    token = encodeURIComponent(token)
    password = encodeURIComponent(password)

    return this.post(`${proxy}/resetpassword`,
      `username=${username}&code=${token}&password=${password}`, {
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
    const uri = `${webIdRoot}/little-sister/index`
    return this.put(this._proxify(uri), '', {
      'Content-type': 'text/turtle'
    })
  }

  initDisclaimer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/disclaimer`
    return this.put(this._proxify(uri),
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

    return this.put(
      this._proxify(uri),
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

    return this.put(
      this._proxify(uri),
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

    return this.put(this._proxify(aclUri), writer.end(), {
      'Content-Type': 'text/turtle'
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }
}

export default AccountsAgent
