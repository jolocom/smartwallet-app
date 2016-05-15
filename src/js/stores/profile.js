import Reflux from 'reflux'
import ProfileActions from 'actions/profile'

import N3 from 'n3'
import WebIDAgent from 'lib/agents/webid.js'
import {Parser, Writer} from 'lib/rdf.js'
import {CERT, FOAF} from 'lib/namespaces.js'

let N3Util = N3.Util
let wia = new WebIDAgent()

let profile = {
  show: false,
  username: null,
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

  onLoad(username) {
    let webid = null
    wia.getWebID(username)
      .then((user) => {
        webid = user
        // now get my profile document
        return wia.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let parser = new Parser()
        parser.parse(xhr.response)
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
    // everything's fixed but name and email
    let fixedTriples = triples.filter((t) => !(t.subject == webid && (t.predicate == FOAF('name') || t.predicate == FOAF('mbox'))))

    let state = {
      webid: webid,
      webidPresent: webid,
      fixedTriples: fixedTriples,
      prefixes: prefixes
    }

    // triples which describe profile
    let relevant = triples.filter((t) => t.subject == webid)

    for (var t of relevant){
      if (t.predicate == FOAF('name')) {
        // name
        state.name =  this._getValue(t.object)
      } else if (t.predicate == FOAF('mbox')) {
        // email
        state.email =  this._getValue(t.object).replace('mailto:', '')
      } else if (t.predicate == FOAF('img')) {
        // image uri
        state.imgUri =  this._getValue(t.object)
      } else if (t.predicate == CERT.key) {
        let key = this._parseKey(t.object, triples)
        if (key.modulus) {state.rsaModulus = this._getValue(key.modulus)}
        if (key.exponent) {state.rsaExponent = this._getValue(key.exponent)}
      }
    }

    profile = Object.assign(profile, state)
    this.trigger(Object.assign({}, profile))
  },

  onUpdate: function (params) {
    // subject which represents our profile
    let writer = new Writer({format: 'N-Triples', prefixes: params.prefixes})
    for (var t of this.state.fixedTriples) {
      writer.addTriple(t)
    }

    writer.addTriple({
      subject: params.webid,
      predicate: FOAF('name'),
      object: N3Util.createLiteral(params.name)
    })
    writer.addTriple({
      subject: params.webid,
      predicate: FOAF('name'),
      object: N3Util.createIRI(params.email)
    })

    writer.end().then((res) => {
      return wia.put(params.webid, {'Content-Type': 'application/n-triples'}, res)
    })

    profile = Object.assign(profile, params)
    this.trigger(Object.assign({}, profile))
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
