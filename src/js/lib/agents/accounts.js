import HTTPAgent from './http.js'
import {proxy} from 'settings'
import $rdf from 'rdflib'
import {PRED} from '../namespaces.js'

class AccountsAgent extends HTTPAgent {
  register(username, password, email, name) {
    username = encodeURIComponent(username)
    password = encodeURIComponent(password)
    email = encodeURIComponent(email)

    return this.post(`${proxy}/register`, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }, `username=${username}&password=${password}&email=${email}`)
    .then(({webid}) => {
      let triples = []
      if (name) {
        triples.push({
          subject: $rdf.sym(webid),
          predicate: PRED.givenName,
          object: name
        })
      }

      if (email) {
        triples.push({
          subject: $rdf.sym(webid),
          predicate: PRED.email,
          // Keep an eye on this.
          object: $rdf.sym(`mailto:${email}`)
        })
      }

      this.patch(webid, null, triples)
    })
  }

  initInbox() {

  }

  checkLogin(webId) {
    return this.patch(`${proxy}/proxy?url=${webId}`)
  }

  login(username, password) {
    username = encodeURIComponent(username)
    password = encodeURIComponent(password)

    this.post(`${proxy}/login`, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    },
      `username=${username}&password=${password}`
    )
  }

  logout() {
    this.post(`${proxy}/logout`, {
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    })
  }
}

export default AccountsAgent
