import Reflux from 'reflux'
import Account from 'actions/account'
import {proxy} from 'settings'

export default Reflux.createStore({
  listenables: Account,

  state: {
    loggingIn: false,
    username: localStorage.getItem('webId')
  },

  getInitialState() {
    return this.state
  },

  init: function(){
    this.state = {
      username: null
    }
    
  },

  onSignup(data) {
    let user = encodeURIComponent(data.username)
    let pass = encodeURIComponent(data.password)

    fetch(`${proxy}/register`, {
      method: 'POST',
      body: `username=${user}&password=${pass}`,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
      }
    }).then((res)=>{
      res.json().then(()=>{
        Account.login(user, pass)
      })
    })
  },

  onLogin(username, password) {
    if (localStorage.getItem('webId')){
      Account.login.completed(localStorage.getItem('webId')) 
    } else if (username && password) {
      let user = encodeURIComponent(username)
      let pass = encodeURIComponent(password)
  
      fetch(`${proxy}/login`, {
        method: 'POST',
        body: `username=${user}&password=${pass}`,
        credentials: 'include',
        headers: {
          'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
        }
      }).then((res)=>{
        res.json().then((js)=>{
          Account.login.completed(js.webid)
        })
      })
    }
  },

  // Triggers when the login is done.
  // TODO support certificate login as well.
  onLoginCompleted(webid){
    localStorage.setItem('auth-mode', 'proxy')
    localStorage.setItem('webId', webid)
    this.trigger({username: `${proxy}webid`})
  },

  onLogout(){
    fetch(`${proxy}/logout`, {
      method: 'POST',
      credentials: 'include',
      // Not sure if the headers are necessary.
      headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
      }
    })

    this.state = {
      loggingIn: false,
      username: null
    }
    localStorage.removeItem('webId')
    localStorage.removeItem('auth-mode')
    this.trigger(this.state)
  },

  loggedIn() {
    // How would this work now?
    return localStorage.getItem('webId')
  }
})

