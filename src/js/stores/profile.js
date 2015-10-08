import Reflux from 'reflux'
import ProfileActions from 'actions/profile'

import N3 from 'n3'
import WebIDAgent from 'lib/agents/webid.js'
import {Parser, Writer} from 'lib/rdf.js'
import {CERT, FOAF} from 'lib/namespaces.js'

let N3Util = N3.Util
let wia = new WebIDAgent()

let ProfileStore = Reflux.createStore({
  listenables: ProfileActions,

  // init() {
  //   this.show = false
  // },

  getInitialState () {
    return {
      show: false,
      name: 'Jolocom',
      email: 'contact@jolocom.com',
      rsaModulus: '(rsa modulus missing)',
      rsaExponent: '(rsa exponent missing)',
      webid: '#',
      webidPresent: '(webid missing)',
      imgUri: '/img/person-placeholder.png',
      fixedTriples: [],
      prefixes: []
    }
  },

  onShow() {
    console.log('show profile')
    this.show = true

    this.trigger({
      show: this.show
    })
  },

  onHide() {
    this.show = false

    this.trigger({
      show: this.show
    })
  },

  onLoad() {
    let webid = null
    wia.getWebID()
      .then((user) => {
        console.log('got webid')
        webid = user
        console.log(webid)
        // now get my profile document
        return wia.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((res) => {
        ProfileActions.load.completed(webid, res.triples, res.prefixes)
      })
      .catch(ProfileActions.load.failed)
  },

  onLoadFailed(err) {
    console.error(err)
  },

  // change state from triples
  onLoadCompleted(webid, triples, prefixes) {
    // subject which represents our profile
    console.log('loadcompleted', webid, triples, prefixes)
    // everything's fixed but name and email
    let fixedTriples = triples.filter((t) => !(t.subject == webid && (t.predicate == FOAF.name || t.predicate == FOAF.mbox)))

    let state = {
      webid: webid,
      webidPresent: webid,
      fixedTriples: fixedTriples,
      prefixes: prefixes
    }

    // triples which describe profile
    let relevant = triples.filter((t) => t.subject == webid)

    for (var t of relevant){
      if (t.predicate == FOAF.name) {
        // name
        state.name =  this._getValue(t.object)
      } else if (t.predicate == FOAF.mbox) {
        // email
        state.email =  this._getValue(t.object).replace('mailto:', '')
      } else if (t.predicate == FOAF.img) {
        // image uri
        state.imgUri =  this._getValue(t.object)
      } else if (t.predicate == CERT.key) {
        let key = this._parseKey(t.object, triples)
        if (key.modulus) {state.rsaModulus = this._getValue(key.modulus)}
        if (key.exponent) {state.rsaExponent = this._getValue(key.exponent)}
      }
    }
    console.log('state', state)
    // this.trigger(state)
  },

  onUpdate: function (profile) {
    // subject which represents our profile
    console.log('saving profile')
    console.log(profile)
    let writer = new Writer({format: 'N-Triples', prefixes: profile.prefixes})
    for (var t of this.state.fixedTriples) {
      writer.addTriple(t)
    }

    writer.addTriple({
      subject: profile.webid,
      predicate: FOAF.name,
      object: N3Util.createLiteral(profile.name)
    })
    writer.addTriple({
      subject: profile.webid,
      predicate: FOAF.mbox,
      object: N3Util.createIRI(profile.email)
    })

    writer.end().then((res) => {
      return wia.put(profile.webid, {'Content-Type': 'application/n-triples'}, res)
    })
  },

  // get object value without caring whether it's a literal or IRI
  _getValue (object) {
    if (N3Util.isLiteral(object)) {
      return N3Util.getLiteralValue(object)
    } else {
      return object
    }
  },

  // extract RSA public key from triples
  _parseKey (keySubject, triples) {
    let relevant = triples.filter((t) => t.subject == keySubject)
    let exponents = relevant.filter((t) => t.predicate == CERT.exponent)
    let modulii = relevant.filter((t) => t.predicate == CERT.modulus)

    // pick out first encountered modulus and exponent
    return {
      exponent: (exponents.length == 0 ? null : exponents[0].object),
      modulus: (modulii.length == 0 ? null : modulii[0].object)
    }
  }
})

export default ProfileStore
