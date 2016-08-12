import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import accountActions from '../actions/account'
import GraphActions from 'actions/graph-actions'
import GraphStore from 'stores/graph-store'
import GraphAgent from 'lib/agents/graph.js'
import WebIDAgent from 'lib/agents/webid.js'
import {Parser} from 'lib/rdf.js'
import {PRED} from 'lib/namespaces'
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
  bitcoinAddress: '',
  bitcoinAddressNodeUri: '',
  passportImgUri: '',
  passportImgNodeUri: '',
  webid: '#',
  imgUri: null
}

export default Reflux.createStore({
  listenables: ProfileActions,

  init() {
    this.listenTo(accountActions.logout, this.onLogout)
    this.listenTo(GraphStore, this.graphUpdate)
    this.gAgent = new GraphAgent()
  },

  graphUpdate(data) {
    if (data && data.center) {
      profile.storage = data.center.storage
      profile.currentNode = data.center.uri
      this.trigger(Object.assign({}, profile))
    }
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
      } else if (t.predicate.uri === PRED.bitcoin.uri) {
        profile.bitcoinAddressNodeUri = obj;
        this.gAgent.findObjectsByTerm(obj,PRED.description).then((res) => {
          profile.bitcoinAddress = res.length ? res[0].value : '';
        })
      } else if (t.predicate.uri === PRED.passport.uri) {
        profile.passportImgNodeUri = obj;
        this.gAgent.findObjectsByTerm(obj,PRED.image).then((res) => {
          profile.passportImgUri = res.length ? res[0].value : '';
          console.log('HYDRATE',profile.passportImgNodeUri,profile.passportImgUri)
        })
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
      passportImgUri: null,
      passportImgNodeUri: null
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
    
    console.log('old',oldData)
    console.log('new',newData)

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
    
    // ############## BITCOIN
    
    let updateBtcFetch = []
    
    if (params.bitcoinAddress.trim() != profile.bitcoinAddress.trim())
    {
    
      if (!params.bitcoinAddress.trim())
      {
        // IF NEW VALUE IS NO VALUE
        // DELETE
        
        // Delete node
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${params.bitcoinAddressNodeUri}`,{
          method: 'DELETE',
          credentials: 'include'
        }))
        
        // Delete node ACL
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${params.bitcoinAddressNodeUri}.acl`,{
          method: 'DELETE',
          credentials: 'include'
        }))
        
        // Delete link
        let btcDeleteStatement = 'DELETE DATA { ' + rdf.st(rdf.sym(oldData.webid), PRED.isRelatedTo, rdf.sym(profile.bitcoinAddressNodeUri)).toNT() + ' ';
        
        // Delete btc link
        btcDeleteStatement += rdf.st(rdf.sym(oldData.webid), PRED.bitcoin, rdf.sym(profile.bitcoinAddressNodeUri)).toNT() + ' }';
        
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${oldData.webid}`,{
          method: 'PATCH',
          credentials: 'include',
          body: btcDeleteStatement,
          headers: {
            'Content-Type':'application/sparql-update'
          }
        }))
        
      }
      else if (!profile.bitcoinAddress.trim())
      { 
        // IF OLD VALUE IS NO VALUE
        // CREATE
        
        // Create node and create link
        updateBtcFetch.push(this.gAgent.createNode(GraphStore.state.user, GraphStore.state.center, 'Bitcoin Address', params.bitcoinAddress, undefined, 'default').then(function(bitcoinNode){
          
          newData.bitcoinAddressNodeUri = bitcoinNode.uri

          // Insert btc link
          let btcInsertStatement = 'INSERT DATA { ' + rdf.st(rdf.sym(oldData.webid), PRED.bitcoin, bitcoinNode).toNT() + ' }';

          return fetch(`${proxy}/proxy?url=${oldData.webid}`,{ // @TODO @LEGACY @FIXME @PROXY
            method: 'PATCH',
            credentials: 'include',
            body: btcInsertStatement,
            headers: {
              'Content-Type':'application/sparql-update'
            }
          })
          
        }))        
        
      }
      else 
      {
        // UPDATE
        let btcDeleteStatement = 'DELETE DATA { ' + rdf.st(rdf.sym(params.bitcoinAddressNodeUri), PRED.description, profile.bitcoinAddress).toNT() + ' }';
        let btcInsertStatement = 'INSERT DATA { ' + rdf.st(rdf.sym(params.bitcoinAddressNodeUri), PRED.description, params.bitcoinAddress).toNT() + ' }';      
        
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${params.bitcoinAddressNodeUri}`,{
          method: 'PATCH',
          credentials: 'include',
          body:`${btcDeleteStatement} ${btcInsertStatement} ;` ,
          headers: {
            'Content-Type':'application/sparql-update'
          }
        }))
      }
    }
    
    
    // ############## PASSPORT
    
    let updatePassportFetch = [];
    
    if (oldData.passportImgUri.trim()) // if there is a passport node
    {
      if (!newData.passportImgUri.trim()) // if new uri is empty
      {
        console.log('REMOVE EVERYTHING')    
      }
      else if (oldData.passportImgUri.trim() != newData.passportImgUri.trim()) // if the uri has changed
      {
        console.log('UPDATE PASSPORT NODE')
        
        // UPDATE
        let passportDeleteStatement = 'DELETE DATA { ' + rdf.st(rdf.sym(newData.passportImgNodeUri), PRED.image, oldData.passportImgUri).toNT() + ' }';
        let passportInsertStatement = 'INSERT DATA { ' + rdf.st(rdf.sym(newData.passportImgNodeUri), PRED.image, newData.passportImgUri).toNT() + ' }';      
        
        updatePassportFetch.push(fetch(`${proxy}/proxy?url=${newData.passportImgNodeUri}`,{
          method: 'PATCH',
          credentials: 'include',
          body:`${passportDeleteStatement} ${passportInsertStatement} ;` ,
          headers: {
            'Content-Type':'application/sparql-update'
          }
        }))
        
        // Delete previous image
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${oldData.passportImgUri}`,{
          method: 'DELETE',
          credentials: 'include'
        }))
        
        // Delete previous image ACL
        updateBtcFetch.push(fetch(`${proxy}/proxy?url=${oldData.passportImgUri}.acl`,{
          method: 'DELETE',
          credentials: 'include'
        }))
        
      }
    }
    else // if there's no passport node
    {
      if (newData.passportImgUri.trim()) // if there is a new uri
      {
        console.log('create passport node and blah')
        
        // Create node and create link
        updatePassportFetch.push(this.gAgent.createNode(GraphStore.state.user, GraphStore.state.center, 'Passport', undefined, newData.passportImgUri, 'default', true).then(function(passportNode){
          
          newData.passportImgNodeUri = passportNode.uri
          console.log('setting newdata passporti mage node uri', newData.passportImgNodeUri)

          // Insert passport link
          let passportInsertStatement = 'INSERT DATA { ' + rdf.st(rdf.sym(oldData.webid), PRED.passport, passportNode).toNT() + ' }';

          return fetch(`${proxy}/proxy?url=${oldData.webid}`,{ // @TODO @LEGACY @FIXME @PROXY
            method: 'PATCH',
            credentials: 'include',
            body: passportInsertStatement,
            headers: {
              'Content-Type':'application/sparql-update'
            }
          })
          
        }))        
      }
    }
    
    
    
    return new Promise((res, rej) => {
      if (false && !deleteStatement && !insertStatement) { // @TODO
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
          return Promise.all(updateBtcFetch.concat(updatePassportFetch))
        }).then((result) => {

          /* This is supposed to refresh the graph. Does not
           * work well enough. Find a better way to do it.
           */
          if (params.currentNode) {
            GraphActions.drawAtUri(params.currentNode, 0)
          }
          profile.currentNode = params.currentNode
          this.trigger(Object.assign(profile, newData))
          // res(result)
          res()
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
