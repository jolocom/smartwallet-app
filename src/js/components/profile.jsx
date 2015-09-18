import React from 'react/addons'
import N3 from 'n3'
import WebAgent from '../lib/web-agent.js'
import {Parser, Writer} from '../lib/rdf.js'
import {CERT, FOAF} from '../lib/namespaces.js'

let N3Util = N3.Util

let Profile = React.createClass({
  mixins: [React.addons.LinkedStateMixin],

  getInitialState: function () {
    return {
      edit: false,
      name: '(name missing)',
      email: '(email missing)',
      rsaModulus: '(rsa modulus missing)',
      rsaExponent: '(rsa exponent missing)',
      webid: '#',
      webidPresent: '(webid missing)',
      imgUri: '/img/person-placeholder.png',
      fixedTriples: [],
      prefixes: []
    }
  },

  // get object value without caring whether it's a literal or IRI
  _getValue: function (object) {
    if (N3Util.isLiteral(object)) {
      return N3Util.getLiteralValue(object)
    } else {
      return object
    }
  },

  // extract RSA public key from triples
  _parseKey: function (keySubject, triples) {
    let relevant = triples.filter((t) => t.subject == keySubject)
    let exponents = relevant.filter((t) => t.predicate == CERT.exponent)
    let modulii = relevant.filter((t) => t.predicate == CERT.modulus)

    // pick out first encountered modulus and exponent
    return {
      exponent: (exponents.length == 0 ? null : exponents[0].object),
      modulus: (modulii.length == 0 ? null : modulii[0].object)
    }
  },

  // change state from triples
  _profileDocumentLoaded: function (webid, triples, prefixes) {
    // subject which represents our profile

    // everything's fixed but name and email
    let fixedTriples = triples.filter((t) => !(t.subject == webid && (t.predicate == FOAF.name || t.predicate == FOAF.mbox)))

    let state = {
      edit: this.state.edit,
      name: '(name missing)',
      email: '(email missing)',
      rsaModulus: '(rsa modulus missing)',
      rsaExponent: '(rsa exponent missing)',
      webid: webid,
      webidPresent: webid,
      imgUri: '/img/person-placeholder.png',
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
        state.email =  this._getValue(t.object)
      } else if (t.predicate == FOAF.img) {
        // image uri
        state.imgUri =  this._getValue(t.object)
      } else if (t.predicate == CERT.key) {
        let key = this._parseKey(t.object, triples)
        if (key.modulus) {state.rsaModulus = this._getValue(key.modulus)}
        if (key.exponent) {state.rsaExponent = this._getValue(key.exponent)}
      }
    }
    this.setState(state)
  },

  _saveProfile: function () {
    // subject which represents our profile
    console.log('saving profile')
    console.log(this.state)
    let writer = new Writer({format: 'N-Triples', prefixes: this.state.prefixes})
    for (var t of this.state.fixedTriples) {
      writer.addTriple(t)
    }

    writer.addTriple({
      subject: this.state.webid,
      predicate: FOAF.name,
      object: N3Util.createLiteral(this.state.name)
    })
    writer.addTriple({
      subject: this.state.webid,
      predicate: FOAF.mbox,
      object: N3Util.createIRI(this.state.email)
    })

    writer.end().then((res) => {
      return WebAgent.put(this.state.webid, {'Content-Type': 'application/n-triples'}, res)
    })
  },

  // switch between edit and presentation modes
  _onClickEditSave: function() {
    if (this.state.edit) {
      this._saveProfile()
    }

    this.setState((prevState) => {
      prevState.edit = !prevState.edit
      return prevState
    })
  },

  // if you press return key in input fields
  _handleSubmit: function (e) {
    e.preventDefault()
    if (this.state.edit) {
      this._saveProfile()
    }
    console.log('submit')

  },

  componentDidMount: function() {
    console.log('profile component did mount')

    var webid = null

    // who am I? (check 'User' header)
    WebAgent.head(document.location.origin)
      .then((xhr) => {
        console.log('head')
        console.log(xhr)
        webid = xhr.getResponseHeader('User')

        // now get my profile document
        return WebAgent.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let parser = new Parser()
        return parser.parse(xhr.response)
      })
      .then((res) => {
        // render relevant information in UI
        this._profileDocumentLoaded(webid, res.triples, res.prefixes)
      })
      .catch((err) => {
        console.log('error')
        console.log(err)
      })
  },

  render: function() {
    console.log(this.state)
    if (!this.state.edit) {
      // presentation mode
      return (
        <div className="profile">
          <div className="profile-edit" onClick={this._onClickEditSave}>
            Edit
          </div>
          <div className="basic">
            <header className="profile-header">
              <h2>WebID</h2>
              <h3>Digital passport</h3>
              <img src={this.state.imgUri}/>
            </header>
            <main className="profile-main">
              <section className="profile-basic-info">
                <h3 className="profile-name">{this.state.name}</h3>
                <p className="profile-email">{this.state.email}</p>
                <a className="profile-webid" href={this.state.webid}>{this.state.webidPresent}</a>
              </section>
              <section className="profile-publickey">
                <span className="profile-modulus-label">RSA Modulus: </span>
                <span className="profile-modulus">{this.state.rsaModulus}</span>
                <span className="profile-exponent-label">RSA Exponent: </span>
                <span className="profile-exponent">{this.state.rsaExponent}</span>
              </section>

            </main>
          </div>
        </div>
      )
    } else {
      // edit mode
      return (
        <div className="profile">
          <div className="profile-edit" onClick={this._onClickEditSave}>
            Save
          </div>
          <div className="basic">
            <header className="profile-header">
              <h2>WebID</h2>
              <h3>Digital passport</h3>
              <img src={this.state.imgUri}/>
            </header>
            <main className="profile-main">
              <section className="profile-basic-info">
                <form><input className="profile-name" type="text" placeholder="Enter name" onSubmit={this._handleSubmit} valueLink={this.linkState('name')} /></form>
                <form><input className="profile-email" type="text" placeholder="Enter email" onSubmit={this._handleSubmit} valueLink={this.linkState('email')} /></form>
                <a className="profile-webid" href={this.state.webid}>{this.state.webidPresent}</a>
              </section>
              <section className="profile-publickey">
                <span className="profile-modulus-label">RSA Modulus: </span>
                <span className="profile-modulus">{this.state.rsaModulus}</span>
                <span className="profile-exponent-label">RSA Exponent: </span>
                <span className="profile-exponent">{this.state.rsaExponent}</span>
              </section>

            </main>
          </div>
        </div>
      )
    }
  }
})

export default Profile
