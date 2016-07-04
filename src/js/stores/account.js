import Reflux from 'reflux'
import Account from 'actions/account'
import $ from 'jquery'

export default Reflux.createStore({
  listenables: Account,

  getInitialState() {
    return {
      username: null
    }
  },

  init: function(){
    this.state = {
      username: null
    }
    
  },

  onSignup(data) {
    fetch('https://proxy.webid.jolocom.de/register', {
      method: 'POST',
      // Add the urlencoding here?
      body: {username: data.username , password: data.password},
    }).then((res)=>{
      res.json().then((js)=>{
        Account.login.completed(js.webid)
      })
    })
  },

  onLogin(username, password) {
    fetch('https://proxy.webid.jolocom.de/login', {
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

  onLogout() {
    localStorage.removeItem('fake-user')
    this.trigger({username: null})
  },

  loggedIn() {
    // How would this work now?
    return localStorage.getItem('fake-user')
  }
})

