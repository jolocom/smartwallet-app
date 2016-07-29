import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import accountActions from '../actions/account'
import GraphActions from 'actions/graph-actions'
import WebIDAgent from 'lib/agents/webid.js'
import {Parser} from 'lib/rdf.js'
import {proxy} from 'settings'
import rdf from 'rdflib'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let CERT = rdf.Namespace('http://www.w3.org/ns/auth/cert#')

let wia = new WebIDAgent()

let profile = {
  show: false,
  fullName: '',
  givenName: '',
  familyName: '',
  email: '',
  webid: '#',
  imgUri: null,
}

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.listenTo(accountActions.logout, this.onLogout)
  },

  getInitialState () {
    return profile
  },

  onShow() {
    profile.show = true
    this.trigger(Object.assign({}, profile))
  },

  onHide() {
    profile.show = false
    this.trigger(Object.assign({}, profile))
  },

  onLoad() {
    let parser = new Parser()
    wia.getWebID().then((user) => {
      return fetch(`${proxy}/proxy?url=${user}`,{
        method: 'GET', 
        credentials: 'include',
      }).then((res) => {
        return res.text() 
      }).then((text)=>{
        return parser.parse(text,user)        
      }).then((answer)=>{
        ProfileActions.load.completed(user, answer.triples)
      }).catch(ProfileActions.load.failed)
    })
  },

  onLoadFailed(err) {
    console.error('Failed loading webid profile', err)
  },

  // change state from triples
  onLoadCompleted(webid, triples) {
    console.log(profile)
    let relevant = triples.filter((t) => t.subject.uri === webid)
    profile.webid = webid
    for (var t of relevant) {
      let obj = t.object.uri ? t.object.uri : t.object.value
      if (t.predicate.uri === FOAF('givenName').uri) {
        profile.givenName = obj
      } else if (t.predicate.uri === FOAF('familyName').uri) {
        profile.familyName = obj 
      } else if (t.predicate.uri === FOAF('name').uri) {
        profile.fullName = obj
      } else if (t.predicate.uri === FOAF('img').uri) {
        profile.imgUri = obj
      } else if (t.predicate.uri === FOAF('mbox').uri) {
        profile.email = obj.substring(obj.indexOf('mailto:') + 7, obj.length)
      }
    }

    let {fullName, givenName, familyName} = profile
    if (!givenName && !familyName) {
      if (fullName) {
        profile.givenName = fullName.substring(0, fullName.indexOf(' '))
        profile.familyName = fullName.substring(
            givenName.length + 1, fullName.length)
      }
    }
    this.trigger(Object.assign({}, profile))
  },

  onLogout(){
    profile = {
      show: false,
      fullName: '',
      givenName: '',
      familyName: '',
      email: '',
      webid: '#',
      imgUri: null,
    }
  },

  /* @summary Updates the rdf profile based on input
  /* @param {object} params - {familyName: ,givenName: ,email: ,imgUri: }
   */

  onUpdate: function (params) {

    let newData = Object.assign({}, params)
    let oldData = Object.assign({}, profile)

    let insertTriples = [] 
    let deleteTriples = [] 
    let insertStatement = ''
    let deleteStatement = ''

    let predicateMap = {
      familyName: FOAF('familyName'), 
      givenName: FOAF('givenName'), 
      imgUri: FOAF('img'), 
      email: FOAF('mbox') 
    }

    for (let pred in predicateMap) {
      if (newData[pred] !== oldData[pred]){
        if (!oldData[pred] || newData[pred]){
          // inserting
          insertTriples.push({
            subject: rdf.sym(oldData.webid),
            predicate: predicateMap[pred],
            object: newData[pred]
          })      
        }
        if (!newData[pred] || oldData[pred]){
          // delete
          deleteTriples.push({
            subject: rdf.sym(oldData.webid),
            predicate: predicateMap[pred],
            object: oldData[pred]
          })      
        } 
      }
    }

    insertStatement = insertTriples.map((t)=>{
      if (t.predicate.uri === FOAF('mbox').uri) {
        t.object = rdf.sym(`mailto:${t.object}`)
      }
      return rdf.st(t.subject, t.predicate, t.object).toNT() 
    }).join(' ')

    deleteStatement = deleteTriples.map((t)=>{
      if (t.predicate.uri === FOAF('mbox').uri) {
        t.object = rdf.sym(`mailto:${t.object}`)
      }
      return rdf.st(t.subject, t.predicate, t.object).toNT() 
    }).join(' ')

    if (deleteStatement) {
      deleteStatement = `DELETE DATA { ${deleteStatement} }`
    }
    if (insertStatement) {
      insertStatement = `INSERT DATA { ${insertStatement} }`
    }
     
    return new Promise((res, rej) => {
      if (!deleteStatement && !insertStatement) {
        this.trigger(Object.assign(profile, newData))
      } else {
        fetch(`${proxy}/proxy?url=${oldData.webid}`,{
          method: 'PATCH', 
          credentials: 'include',
          body:`${deleteStatement} ${insertStatement} ;` ,
          headers: {
            'Content-Type':'application/sparql-update' 
          }
        }).then((result) => {
          // TODO Works weird if your node is note centered
          if (params.currentNode) {
            GraphActions.drawAtUri(params.currentNode, 0)
          }
          this.trigger(Object.assign(profile, newData))
          res(result) 
        }).catch((e) => {
          rej(e) 
        })
      }
    })

  },
  

  // extract RSA public key from triples
  _parseKey (keySubject, triples) {
    let relevant = triples.filter((t) => t.subject === keySubject)
    let exponents = relevant.filter((t) => t.predicate === CERT.exponent)
    let modulii = relevant.filter((t) => t.predicate === CERT.modulus)

    // pick out first encountered modulus and exponent
    return {
      exponent: (exponents.length === 0 ? null : exponents[0].object),
      modulus: (modulii.length === 0 ? null : modulii[0].object)
    }
  }
})
