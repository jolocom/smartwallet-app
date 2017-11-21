import HTTPAgent from './http'
import {PRED} from '../namespaces'
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

  updateEmail(webId, email) {
    const writer = new Writer()

    if (email) {
      writer.add(
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
}

export default AccountsAgent
