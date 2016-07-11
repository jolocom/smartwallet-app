import Reflux from 'reflux'
import ProfileActions from 'actions/profile'

import WebIDAgent from 'lib/agents/webid.js'
import {Parser, Writer} from 'lib/rdf.js'
import rdf from 'rdflib'
import GraphActions from 'actions/graph-actions'

let FOAF = rdf.Namespace('http://xmlns.com/foaf/0.1/')
let CERT = rdf.Namespace('http://www.w3.org/ns/auth/cert#')

let wia = new WebIDAgent()

let profile = {
  show: false,
  username: localStorage.getItem('fake-user'),
  name: '',
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
    wia.getWebID()
      .then((user) => {
        webid = user
        // now get my profile document
        return wia.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let parser = new Parser()
        return parser.parse(xhr.response, xhr.responseURL)
      })
      .then((res) => {
        ProfileActions.load.completed(webid, res.triples, res.prefixes)
      })
      .catch(ProfileActions.load.failed)
  },

  onLoadFailed(err) {
    console.error('failed loading webid profile', err)
  },

  // change state from triples
  onLoadCompleted(webid, triples, prefixes) {
    // subject which represents our profile
    // everything's fixed but name and email
    let fixedTriples = triples.filter((t) => {
      return !(
        t.predicate.uri === FOAF('familyName').uri ||
        t.predicate.uri === FOAF('givenName').uri ||
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
        this.state.name = t.object.value
      } else if (t.predicate.uri === FOAF('familyName').uri) {
        this.state.familyName =  t.object.value
      } else if (t.predicate.uri === FOAF('name').uri) {
        this.state.fullName = t.object.value
      } else if (t.predicate.uri === FOAF('img').uri) {
        this.state.imgUri = t.object.uri
      } else if (t.predicate.uri === FOAF('mbox').uri) {
        this.state.email = t.object.uri.substring(
          t.object.uri.indexOf(':')+1, t.object.uri.length
        )
      }
    }

    let {fullName, name, familyName} = this.state
    if (!name && !familyName) {
      if (fullName){
        name = fullName.substring(0, fullName.indexOf(' '))
        familyName = fullName.substring(name.length, fullName.length)
      }
    }

    profile = Object.assign(profile, this.state)
    this.trigger(Object.assign({}, profile))
  },

  onUpdate: function (params) {
    // subject which represents our profilei
    let writer = new Writer()
    for (var t of profile.fixedTriples) {
      writer.addTriple(t.subject, t.predicate, t.object)
    }
    writer.addTriple(rdf.sym('#me'), FOAF('givenName'), params.name)
    writer.addTriple(rdf.sym('#me'), FOAF('familyName'), params.familyName)
    if (params.email) {
      // This seems to be a standard,
      // did not find justification for this syntax, will keep looking.
      writer.addTriple(
        rdf.sym('#me'), FOAF('mbox'), rdf.sym(`mailto:${params.email}`)
      )
    }
    if (params.imgUri) {
      writer.addTriple(rdf.sym('#me'), FOAF('img'), params.imgUri)
    }

    const headers = {'Content-Type': 'application/n-triples'}

    wia.put(params.webid, headers, writer.end()).then(()=>{
      if (params.currentNode) {
        GraphActions.drawAtUri(params.currentNode, 0)
      }
    })

    profile = Object.assign(profile, params)
    this.trigger(Object.assign({}, profile))
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
