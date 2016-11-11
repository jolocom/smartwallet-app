import Reflux from 'reflux'
import Account from 'actions/account'
import {proxy} from 'settings'
import AccountsAgent from 'lib/agents/accounts'
import GraphAgent from 'lib/agents/graph'
import WebIdAgent from 'lib/agents/webid'
import rdf from 'rdflib'
import {PRED} from 'lib/namespaces'

import SnackbarActions from 'actions/snackbar'

export default Reflux.createStore({
  listenables: Account,

  state: {
    loggingIn: true,
    userExists: false,
    emailVerifyScreen: false
  },

  getInitialState() {
    return this.state
  },

  init() {
    this.accounts = new AccountsAgent()
  },

  onSignup({username, password, email, name}) {
    localStorage.setItem('jolocom.auth-mode', 'proxy')

    this.accounts.register(username, password, email, name).then((account) => {
      Account.login.completed(username, account.webid)
    }).catch((e) => {
      console.log(e)
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
   * @param {object} updatePayload - contains the name / email of a newly
   * created user. Only used when registering a new user.
  */

  onLogin(username, password) {
    const webId = localStorage.getItem('jolocom.webId')
    if (webId) {
      this.trigger({loggingIn: true})

      // Check if the cookie is still valid
      this.accounts.checkLogin(webId).then(() => {
        Account.login.completed(
          localStorage.getItem('jolocom.username'),
          localStorage.getItem('jolocom.webId')
        )
      }).catch(() => {
        Account.logout()
      })
    } else if (username && password) {
      this.trigger({loggingIn: true})

      this.accounts.login(username, password).then((account) => {
        if (updatePayload) {
          this.onSetNameEmail(
            account.webid, updatePayload.name, updatePayload.email
          ).then(() => {
            Account.login.completed(username, account.webid)
          }).then(() => {
            const webIdAgent = new WebIdAgent()
            webIdAgent.initInbox(account.webid)
          })
        } else {
          Account.login.completed(username, account.webid)
        }
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
      this.accounts.logout()
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
  }
})
