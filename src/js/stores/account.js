import Reflux from 'reflux'
import Account from 'actions/account'
import {proxy} from 'settings'
import {PRED} from 'lib/namespaces'
import WebIdAgent from 'lib/agents/webid'
import GraphAgent from 'lib/agents/graph'
import Util from 'lib/util'
import $rdf from 'rdflib'

import SnackbarActions from 'actions/snackbar'

export default Reflux.createStore({
  listenables: Account,

  state: {
    loggingIn: true,
    userExists: false,
    emailVerifyScreen: false,
    emailVerifyCompleted: false,
    emailUpdateQueued: false,
    emailToBeInserted: ''
  },

  getInitialState() {
    return this.state
  },

  onSignup(data) {
    const usr = encodeURIComponent(data.username)
    const psw = encodeURIComponent(data.password)
    const eml = encodeURIComponent(data.email)
    const name = encodeURIComponent(data.name)

    fetch(`${proxy}/register`, {
      method: 'POST',
      body: `username=${usr}&password=${psw}&name=${name}&email=${eml}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((res) => {
      if (res.status === 400) {
        throw new Error('USERNAME_TAKEN')
      }
      this.state = {
        emailVerifyScreen: true
      }
      this.trigger(this.state)
    }).catch((e) => {
      if (e.message === 'USERNAME_TAKEN') {
        SnackbarActions.showMessage('Username is already taken.')
      } else {
        SnackbarActions.showMessage('An account error has occured.')
      }
    })
  },

  /* @summary logs a user in. In case there's a updatePayload, first
   * applies the update and then logs the user.
   * @param {string} username
   * @param {string} password
   * created user. Only used when registering a new user.
  */

  // TODO break down a bit, use agents
  onLogin(username, password) {
    const webId = localStorage.getItem('jolocom.webId')
    // The user is already logged in.
    if (webId) {
      // Check if the session expired (?)
      this.trigger({loggingIn: true})
      fetch(Util.uriToProxied(webId), {
        method: 'HEAD',
        credentials: 'include'
      }).then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText)
        }

        Account.login.completed(
          localStorage.getItem('jolocom.username'),
          localStorage.getItem('jolocom.webId')
        )
      }).catch(() => {
        Account.logout()
      })
    } else if (username && password) {
      this.trigger({loggingIn: true})
      // TODO Move to agent
      fetch(`${proxy}/login`, {
        method: 'POST',
        body: `username=${username}&password=${password}`,
        credentials: 'include',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      }).then((res) => {
        if (!res.ok) {
          throw new Error('Login authentication failed.')
        }

        res.json().then((js) => {
          const webIdAgent = new WebIdAgent()
          webIdAgent.initInbox(js.webid)
          webIdAgent.initIndex(js.webid)
          webIdAgent.initDisclaimer(js.webid)

          if (this.state.emailUpdateQueued) {
            Account.updateUserEmail(
              this.state.emailToBeInserted, js.webid, username)
          } else {
            Account.login.completed(username, js.webid)
          }
        })
      }).catch((e) => {
        SnackbarActions.showMessage('Login authentication failed.')
      })
    } else {
      this.trigger({loggingIn: false})
    }
  },

  onLoginCompleted(username, webId) {
    localStorage.setItem('jolocom.auth-mode', 'proxy')
    localStorage.setItem('jolocom.username', username)
    localStorage.setItem('jolocom.webId', webId)

    this.state = {
      loggingIn: false,
      username: username,
      webId: webId
    }

    this.trigger(this.state)
  },

  onLogout() {
    const authMode = localStorage.getItem('jolocom.auth-mode')

    if (authMode === 'proxy') {
      fetch(`${proxy}/logout`, {
        method: 'POST',
        credentials: 'include',
        // Not sure if the headers are necessary.
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
      })
    }

    this.state = {
      loggingIn: false,
      username: null
    }

    localStorage.removeItem('jolocom.username')
    localStorage.removeItem('jolocom.webId')
    localStorage.removeItem('jolocom.auth-mode')

    this.trigger(this.state)
  },

  loggedIn() {
    // How would this work now?
    return localStorage.getItem('jolocom.webId')
  },

  // TODO Move to the appropriate agent.
  onActivateEmail(user, code) {
    fetch(`${proxy}/verifyemail`, {
      method: 'POST',
      body: `username=${user}&code=${code}`,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then((res) => {
      if (!res.ok) {
        throw new Error(res.statusText)
      }
      res.json().then(js => {
        this.state.emailVerifyCompleted = true
        this.state.emailUpdateQueued = true
        this.state.emailToBeInserted = js.email
        this.trigger(this.state)
      })
    }).catch((e) => {
      Account.activateEmail.failed(e)
      // console.error(e)
    })
  },

  onUpdateUserEmail(email, webId, username) {
    const gAgent = new GraphAgent()
    gAgent.writeTriples(webId, [{
      subject: $rdf.sym(webId),
      predicate: PRED.email,
      object: $rdf.sym(`mailto:${email}`)
    }]).then(() => {
      Account.login.completed(username, webId)
    })
  },

  onActivateEmailCompleted() {
    SnackbarActions.showMessage('Your account has been activated!')
    this.state.emailVerifyCompleted = true
    this.trigger(this.state)
  },

  onActivateEmailFailed(e) {
    SnackbarActions.showMessage('Account activation failed.')
  }
})
