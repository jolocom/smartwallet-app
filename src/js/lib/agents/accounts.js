import HTTPAgent from './http'
import $rdf from 'rdflib'
import {PRED} from '../namespaces'
import Util from '../util'
import {Writer} from '../rdf'
import querystring from 'querystring'
import * as settings from 'settings'

class AccountsAgent {
  constructor() {
    this.http = new HTTPAgent({proxy: false})
    this.httpProxied = new HTTPAgent({proxy: true})
  }

  checkUsername(username) {
    return new Promise((resolve, reject) => {
      this.http.head(`https://${username}.webid.jolocom.de/profile/card#me`)
      .then((response) => {
        reject(new Error('This username already exists!'))
      })
      .catch((e) => {
        // console.log(e.typeError)
        if (!!e.response && e.response.status === 401) {
          resolve()
        } else {
          // eslint-disable-next-line max-len
          reject(new Error('network error, please make sure you have an internet connection'))
        }
      })
    })
  }

  register(username, password, email, name) {
    return this.http.post(`${settings.proxy}/register`, querystring.stringify({
      username, password, email, name
    }), {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  solidRegister(username, password, privatekey) {
    return this.http.post(`${settings.proxynew}/register`,
       querystring.stringify({username, password, privatekey}), {
         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
       }
     )
  }

  updateEmail(webId, email) {
    const writer = new Writer()

    if (email) {
      writer.add(
        $rdf.sym(webId), PRED.email, $rdf.sym(`mailto:${email}`)
      )
    }

    return this.httpProxied.patch(webId, null, writer.all())
  }

  checkLogin(webId) { // Resolves if logged in, rejects if not
    return this.httpProxied.patch(webId)
  }

  login(username, password) { // TODO: Document expected return value
    return this.http.post(`${settings.proxy}/login`,
      querystring.stringify({
        username, password
      }), {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
  }

  async loginAndSetup(username, password, email) {
    const account = await this.login(username, password)
    await this.setupUpdatedAccount(account.webid, email)
    return account
  }

  setupUpdatedAccount(webid, email) {
    return Promise.all([
      this.initInbox(webid),
      this.initIndex(webid),
      this.initDisclaimer(webid)
    ]).then(this.updateEmail(webid, email))
  }

  logout() {
    return this.http.post(`${settings.proxy}/logout`, null, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }

  verifyEmail(username, code) { // Resolves with object {email: '<address>'}
    return this.http.post(`${settings.proxy}/verifyemail`,
      querystring.stringify({
        username, code
      }), {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
  }

  forgotPassword(username) {
    return this.http.post(`${settings.proxy}/forgotpassword`,
      querystring.stringify({
        username
      }), {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      })
  }

  resetPassword(username, code, password) {
    return this.http.post(`${settings.proxy}/resetpassword`,
      querystring.stringify({
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
    // TODO: i18n
    const msg = 'These files keep track of what was shared with your friends.'
    return this.httpProxied.put(uri, msg, {
      'Content-Type': 'text/turtle',
      'Link': 'http://www.w3.org/ns/ldp#BasicContainer; rel="type"'
    })
  }

  initDisclaimer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/disclaimer`
    return this.httpProxied.put(uri,
      // TODO: i18n
      'Files in this folder are needed for features of the Little-Sister app.',
      {'Content-Type': 'text/turtle'}
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
    writer.add('', PRED.primaryTopic, $rdf.sym(uri + '/#inbox'))
    writer.add(uri + '/#inbox', PRED.type, PRED.space)
    return this.httpProxied.put(
      uri,
      writer.end(uri),
      {'Content-Type': 'text/turtle'}
    ).then(() => {
      return this._writeAcl(uri, webId)
    })
  }

  createUnreadMessagesContainer(webId) {
    const webIdRoot = Util.webidRoot(webId)
    const uri = `${webIdRoot}/little-sister/unread-messages`

    let writer = new Writer()

    writer.add('', PRED.maker, webId)
    writer.add('', PRED.primaryTopic, $rdf.sym(uri + '/#unread-messages'))
    writer.add(uri + '/#unread-messages', PRED.type, PRED.space)
    return this.httpProxied.put(
      uri,
      writer.end(uri),
      {'Content-Type': 'text/turtle'}
    ).then(() => {
      return this._writeAcl(uri, webId)
    })
  }

  _writeAcl(uri, webId) {
    let writer = new Writer()
    let ACL = $rdf.Namespace('http://www.w3.org/ns/auth/acl#')
    let aclUri = `${uri}.acl`
    let owner = aclUri + '/#owner'
    let append = aclUri + '/#append'

    writer.addTriple($rdf.sym(owner), PRED.type, ACL('Authorization'))
    writer.addTriple($rdf.sym(owner), ACL('accessTo'), $rdf.sym(uri))
    writer.addTriple($rdf.sym(owner), ACL('accessTo'), $rdf.sym(aclUri))
    writer.addTriple($rdf.sym(owner), ACL('agent'), $rdf.sym(webId))
    writer.addTriple($rdf.sym(owner), ACL('mode'), ACL('Control'))
    writer.addTriple($rdf.sym(owner), ACL('mode'), ACL('Read'))
    writer.addTriple($rdf.sym(owner), ACL('mode'), ACL('Write'))

    writer.addTriple($rdf.sym(append), PRED.type, ACL('Authorization'))
    writer.addTriple($rdf.sym(append), ACL('accessTo'), $rdf.sym(uri))
    writer.addTriple($rdf.sym(append), ACL('agentClass'), PRED.Agent)
    writer.addTriple($rdf.sym(append), ACL('mode'), ACL('Append'))

    return this.httpProxied.put(aclUri, writer.end(aclUri), {
      'Content-Type': 'text/turtle'
    }).then(() => {
      return aclUri
    }).catch((e) => {
      console.error(e, 'occured while putting the acl file')
    })
  }
}

export default AccountsAgent
