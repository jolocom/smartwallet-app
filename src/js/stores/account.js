import Reflux from 'reflux'
import Account from 'actions/account'
import WebIdAgent from 'lib/agents/webid'

const wia = new WebIdAgent()

let AccountStore = Reflux.createStore({
  listenables: Account,

  getInitialState() {
    return {}
  },

  onSignup(data) {
    fetch('/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: data.username,
        password: data.password,
        name: data.name,
        email: data.email
      })
    }).then((response) => {
      return response.json()
    }).then((data) => {
      if (data.success) {
        return wia.fakeSignup(data.username, data.name, data.email)
      } else {
        throw new Error(data.error)
      }
    }).then(() => {
      Account.signup.completed(data.username)
    }).catch(Account.signup.failed)
  },
  onSignupCompleted(username) {
    this.username = username
    this.trigger({username: username})
  },
  onSignupFailed(err) {
    //TODO: trigger failure
    console.log(err)
    this.trigger({username: null, error: err.reason})
  },

  onLogin(username, password) {
    fetch('/login', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'same-origin',
      body: JSON.stringify({
        username: username,
        password: password
      })
    }).then((response) => {
      return response.json()
    }).then((response) => {
      if (response.success) {
        Account.login.completed(username)
      } else {
        throw new Error(response.error)
      }
    }).catch(Account.login.failed)
  },

  onLoginCompleted(username) {
    this.username = username
    this.trigger({username: username})
  },

  onLoginFailed(err) {
    console.log(err)
    this.trigger({error: err.reason})
  },

  onLogout() {
    fetch('/logout', {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    }).then(() => {
      this.username = null
      this.trigger({username: null})
    })
  },

  loggedIn() {
    return this.username
  },

  checkSession() {
    fetch('/user', {
      credentials: 'same-origin',
      headers: {
        'Accept': 'application/json'
      }
    }).then((response) => {
      return response.json()
    }).then((data) => {
      this.username = data.username || null
      this.trigger({
        username: this.username
      })
    }).catch(() => {
      this.username = null
      this.trigger({
        username: null
      })
    })
  }
})

export default AccountStore
