import Reflux from 'reflux'
import Account from 'actions/account'
import solid from 'solid-client'

let AccountStore = Reflux.createStore({
  listenables: Account,

  getInitialState() {
    return {
      username: localStorage.getItem('fake-user')
    }
  },

  onSignup() {
    solid.signup()
  },

  onLogin() {
    solid.login().then((webId) => {
      console.log('webId!', webId)
      this.trigger({username: webId})
    })
  },

  onLogout() {
    localStorage.removeItem('fake-user')
    this.trigger({username: null})
  },

  loggedIn() {
    return localStorage.getItem('fake-user')
  }
})

export default AccountStore
