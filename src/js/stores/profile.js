import Reflux from 'reflux'
import ProfileActions from 'actions/profile'
import GraphActions from 'actions/graph-actions'
import WebIDAgent from 'lib/agents/webid.js'
import {Parser, Writer} from 'lib/rdf.js'
import {proxy} from 'settings'
import rdf from 'rdflib'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let CERT = rdf.Namespace('http://www.w3.org/ns/auth/cert#')

let wia = new WebIDAgent()

let profile = {
  show: false,
  username: localStorage.getItem('fake-user'),
  fullName: '',
  givenName: '',
  familyName: '',
  email: '',
  rsaModulus: '(rsa modulus missing)',
  rsaExponent: '(rsa exponent missing)',
  webid: '#',
  webidPresent: '(webid missing)',
  imgUri: null,
  fixedTriples: [],
  prefixes: []
}

export default Reflux.createStore({
  listenables: ProfileActions,

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
    let webid = null
    let parser = new Parser()
    wia.getWebID().then((user) => {
      webid = user
      return fetch(`${proxy}` + user,{
        method: 'GET', 
        credentials: 'include',
      }).then((res) => {
        return res.text() 
      }).then((text)=>{
        return parser.parse(text,user)        
      }).then((answer)=>{
        ProfileActions.load.completed(webid, answer.triples, answer.prefixes)
      }).catch(ProfileActions.load.failed)
    })
  },

  onLoadFailed(err) {
    console.error('failed loading webid profile', err)
  },

  // change state from triples
  onLoadCompleted(webid, triples, prefixes) {
    // everything's fixed but name, email and image.
    let fixedTriples = triples.filter((t) => {
      return !(
        t.predicate.uri === FOAF('familyName').uri ||
        t.predicate.uri === FOAF('givenName').uri ||
        t.predicate.uri === FOAF('name').uri ||
        t.predicate.uri === FOAF('mbox').uri ||
        t.predicate.uri === FOAF('img').uri
      )
    })

    this.state = {
      webid: webid,
      webidPresent: webid,
      fixedTriples: fixedTriples,
      prefixes: prefixes,
      // @TODO replace this with proper login system
      username: localStorage.getItem('fake-user')
    }

    // triples which describe profile
    let relevant = triples.filter((t) => {
      return t.subject.uri === webid
    })

    for (var t of relevant) {
      // We concat the name and family name.
      if (t.predicate.uri === FOAF('givenName').uri) {
        profile.givenName = t.object.value
      } else if (t.predicate.uri === FOAF('familyName').uri) {
        profile.familyName =  t.object.value
      } else if (t.predicate.uri === FOAF('name').uri) {
        profile.fullName = t.object.value
      } else if (t.predicate.uri === FOAF('img').uri) {
        profile.imgUri = t.object.uri
      } else if (t.predicate.uri === FOAF('mbox').uri) {
        profile.email = t.object.uri.substring(
          t.object.uri.indexOf(':') + 1, t.object.uri.length
        )
      }
    }

    let {fullName, givenName, familyName} = profile
    if (!givenName && !familyName) {
      if (fullName){
        profile.givenName = fullName.substring(0, fullName.indexOf(' '))
        profile.familyName = fullName.substring(givenName.length + 1, fullName.length)
      }
    }

    profile = Object.assign(profile, this.state)
    this.trigger(Object.assign({}, profile))
  },

  // TODO
  // Use patch request.
  // Check if the object was updated, so we don't do a request in vain.
  onUpdate: function (params) {
    // subject which represents our profilei
    let writer = new Writer()
    for (var t of profile.fixedTriples) {
      writer.addTriple(t.subject, t.predicate, t.object)
    }

    writer.addTriple(rdf.sym(params.webid), FOAF('givenName'), params.givenName)
    writer.addTriple(rdf.sym(params.webid), FOAF('familyName'), params.familyName)

    if (params.email) {
      // This seems to be a standard,
      // did not find justification for this syntax, will keep looking.
      writer.addTriple(
        rdf.sym(params.webid), FOAF('mbox'), rdf.sym(`mailto:${params.email}`)
      )
    }
    if (params.imgUri) 
      writer.addTriple(rdf.sym(params.webid), FOAF('img'), params.imgUri)
  
    fetch(`${proxy}`+params.webid, {
      method: 'PUT',
      body: writer.end(),
      credentials: 'include',
      headers: {
        'Content-Type': 'application/n-triples'
      }
    }).then(()=>{
      if(params.currentNode) GraphActions.drawAtUri(params.currentNode, 0)
      profile = Object.assign(profile, params)
      this.trigger(Object.assign({}, profile))
    }).catch(()=>{
      console.log('Error occured while updating profile') 
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
