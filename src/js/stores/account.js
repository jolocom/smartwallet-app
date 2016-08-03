import Reflux from 'reflux'
import Account from 'actions/account'
import {proxy} from 'settings'
import graphAgent from 'lib/agents/graph'
import rdf from 'rdflib'
let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')

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
    localStorage.setItem('auth-mode', 'proxy')

    let user = encodeURIComponent(data.username)
    let pass = encodeURIComponent(data.password)
    let name = data.name
    let email = data.email

    fetch(`${proxy}/register`, {
      method: 'POST',
      body: `username=${user}&password=${pass}`,
      headers: {
        'Content-Type':'application/x-www-form-urlencoded; charset=UTF-8' 
      }
    }).then((res)=>{
      res.json().then((js)=>{
        if (name || email) {
          let payload = {name, email}
          Account.login(user, pass, payload)
        } else {
          Account.login(user, pass)
        }
      })
    })
  },


  /* @summary logs a user in. In case there's a updatePayload, first 
   * applies the update and then logs the user.
   * @param {string} username 
   * @param {string} password
   * @param {object} updatePayload - contains the name / email of a newly
   * created user. Only used when registering a new user.
  */

  onLogin(username, password, updatePayload) {
    
    if (localStorage.getItem('webId')){
      
      // Check if the cookie is still valid
      fetch(`${proxy}/proxy?url=${localStorage.getItem('webId')}`, {
        method: 'PATCH', // using PATCH until HEAD is supported server-side; GET is too costly
        credentials: 'include'
      }).then((res)=>{
        Account.login.completed(localStorage.getItem('webId'))
      }).catch(() => {
        localStorage.removeItem('webId');
        localStorage.removeItem('auth-mode');
        // @TODO redirect to home if tried to access graph directly by URL
      })
      
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
          if (updatePayload) {
            Account.setNameEmail(js.webid, updatePayload.name, updatePayload.email) 
          } else {
          Account.login.completed(js.webid)
          }
        })
      })
    }
  },

  /* @summary in case the user specified a name / email when registering,
   * we update his already created profile with the data he introduced.
   * @param {string} name - the name we update the profile with.
   * @param {string} email - the email we update the profile with.
   */
   
  onSetNameEmail(webid, name, email){
    let gAgent = new graphAgent()
    let triples = []
    if (name) {
      triples.push({
        subject: rdf.sym(webid),
        predicate: FOAF('givenName'),
        object: name
      }) 
    }

    if (email) {
      triples.push({
        subject: rdf.sym(webid),
        predicate: FOAF('mbox'),
        // Keep an eye on this.
        object: rdf.sym(`mailto:${email}`)
      }) 
    }

    gAgent.writeTriples(webid, triples, false).then(()=>{
      Account.login.completed(webid)
    })
  },

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

