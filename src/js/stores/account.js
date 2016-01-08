import Reflux from 'reflux'
import Account from 'actions/account'
import WebIDAgent from '../lib/agents/webid'

let wia = new WebIDAgent()

let AccountStore = Reflux.createStore({
  listenables: Account,

  getInitialState() {
    return {
      username: localStorage.getItem('fake-user')
    }
  },

  onSignup(data) {
    wia.fakeSignup(data.username, data.name, data.email)
      .then(() => {
        Account.signup.completed(data.username)
      })
      .catch(Account.signup.failed)
  },
  onSignupCompleted(username) {
    localStorage.setItem('fake-user', username)
    this.trigger({username: username})
  },
  onSignupFailed(err) {
    //TODO: trigger failure
    console.log(err)

  },

  onLogin(username) {
    localStorage.setItem('fake-user', username)
    this.trigger({username: username})
  },

  loggedIn() {
    return localStorage.getItem('fake-user')
  }
})

export default AccountStore
