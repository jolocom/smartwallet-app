import Reflux from 'reflux'
import Account from 'actions/account'
import solid from 'solid-client'

let AccountStore = Reflux.createStore({
  listenables: Account,

  state: {
    loggingIn: false,
    username: localStorage.getItem('fake-user')
  },

  getInitialState() {
    return this.state
  },

  onSignup() {
    solid.signup()
  },

  onLogin() {
    this.state = {
      loggingIn: true,
      username: null
    }

    this.trigger(this.state)

    solid.login().then(Account.login.completed)
  },

  onLoginCompleted(webId) {
    this.state = {
      loggingIn: false,
      username: webId
    }

    this.trigger(this.state)
  },

  onLogout() {
    localStorage.removeItem('fake-user')

    this.state = {
      loggingIn: false,
      username: null
    }

    this.trigger(this.state)
  },

  loggedIn() {
    return localStorage.getItem('fake-user')
  }
})

export default AccountStore
