import Reflux from 'reflux'
import Account from 'actions/account'
import AccountsAgent from 'lib/agents/accounts'
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

  init() {
    this.accounts = new AccountsAgent()
  },

  onSignup({username, password, email, name}) {
    localStorage.setItem('jolocom.auth-mode', 'proxy')

    this.accounts.register(username, password, email, name).then((account) => {
      this.state = {
        emailVerifyScreen: true
      }
      this.trigger(this.state)
    }).catch((e) => {
      if (e.message) {
        SnackbarActions.showMessage(e.message)
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

  _login(username, password) {
    this.trigger({loggingIn: true})

    return this.accounts.login(username, password).then((account) => {
      Promise.all([
        this.accounts.initInbox(account.webid),
        this.accounts.initIndex(account.webid),
        this.accounts.initDisclaimer(account.webid)
      ])

      if (this.state.emailUpdateQueued) {
        Account.updateUserEmail(
          this.state.emailToBeInserted, account.webid, username)
      } else {
        Account.login.completed(username, account.webid)
      }

      return account.webid
    }).catch(Account.login.failed)
  },

  onLogin(username, password) {
    const webId = localStorage.getItem('jolocom.webId')
    // The user is already logged in.
    if (webId) {
      // Check if the session expired (?)
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
      this._login(username, password)
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

  onLoginFailed(e) {
    SnackbarActions.showMessage('Login authentication failed.')
    this.trigger({loggingIn: false})
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
  },

  onForgotPassword(username) {
    this.accounts.forgotPassword(username)
      .then(Account.forgotPassword.complete)
      .catch(Account.forgotPassword.failed)
  },

  onForgotPasswordComplete() {
    SnackbarActions
      .showMessage('An email was sent to you with further instructions.')
  },

  onForgotPasswordFailed(e) {
    SnackbarActions.showMessage('An error occured : ' + e)
  },

  onResetPassword(username, token, password) {
    this.accounts.resetPassword(username, token, password)
      .then(Account.resetPassword.complete)
      .catch(Account.resetPassword.failed)
  },

  onResetPasswordComplete() {
    SnackbarActions
      .showMessage('You can now log in with your new password.')
  },

  onResetPasswordFailed(e) {
    SnackbarActions.showMessage('An error occured : ' + e)
  },

  onActivateEmail(username, code) {
    this.accounts.verifyEmail(username, code).then(js => {
      Account.activateEmail.completed(js.email)
    }).catch(Account.activateEmail.failed)
  },

  onUpdateUserEmail(email, webId, username) {
    this.accounts.updateEmail(webId, email).then(() => {
      Account.login.completed(username, webId)
    })
  },

  onActivateEmailCompleted(email) {
    SnackbarActions.showMessage('Your account has been activated!')
    this.state.emailUpdateQueued = true
    this.state.emailToBeInserted = email
    this.state.emailVerifyCompleted = true
    this.trigger(this.state)
  },

  onActivateEmailFailed(e) {
    SnackbarActions.showMessage('Account activation failed.')
  }
})
