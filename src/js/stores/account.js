import Reflux from 'reflux'
import Account from 'actions/account'
import {proxy} from 'settings'

export default Reflux.createStore({
  listenables: Account,

  state: {
    loggingIn: false,
    username: localStorage.getItem('fake-user')
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
    fetch(`${proxy}/register`, {
      method: 'POST',
      body: 'username='+data.username+'&password='+data.password, 
      headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
      }
    }).then((res)=>{
      res.json().then((js)=>{
        Account.login.completed(js.webid)
      })
    })
  },

  onLogin(username, password) {
    fetch(`${proxy}/login`, {
      method: 'POST',
      body: 'username='+username+'&password='+password, 
      credentials: 'include',
      headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
      }
    }).then((res)=>{
      res.json().then((js)=>{
        Account.login.completed(js.webid)
      })
    })
  },

  // Triggers when the login is done.
  onLoginCompleted(webid){
    localStorage.setItem('webId', webid)
    this.trigger({username: 'https://proxy.webid.jolocom.de/proxy?url='+webid})
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
		localStorage.removeItem('fake-user')
		this.trigger(this.state)
  },

  loggedIn() {
    // How would this work now?
    return localStorage.getItem('fake-user')
  }
})

