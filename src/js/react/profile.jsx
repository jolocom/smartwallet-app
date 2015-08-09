import React from 'react'
import url from 'url'
import N3 from 'n3'
import WebAgent from '../lib/web-agent.js'
import {CERT, FOAF} from '../lib/namespaces.js'

let N3Util = N3.Util

class Profile extends React.Component {
  constructor(props) {
    super()
    this.parser = N3.Parser()
    this.agent = new WebAgent()
    this.state = {
      edit: false,
      name: "(name missing)",
      email: "(email missing)",
      rsaModulus: "(rsa modulus missing)",
      rsaExponent: "(rsa exponent missing)",
      webid: "#",
      webidPresent: "(webid missing)",
      imgUri: "/img/person-placeholder.png"
    }
  }

  // get object value without caring whether it's a literal or IRI
  getValue(object) {
    if (N3Util.isLiteral(object)) {
      return N3Util.getLiteralValue(object)
    } else {
      return object
    }
  }

  // extract RSA public key from triples
  _parseKey(keySubject, triples) {
    let relevant = triples.filter((t) => t.subject == keySubject)
    let exponents = relevant.filter((t) => t.predicate == CERT.exponent)
    let modulii = relevant.filter((t) => t.predicate == CERT.modulus)

    // pick out first encountered modulus and exponent
    return {
      exponent: (exponents.length == 0 ? null : exponents[0].object),
      modulus: (modulii.length == 0 ? null : modulii[0].object)
    }
  }

  // change state from triples
  _profileDocumentLoaded(webid, triples) {
    let state = {
      edit: false,
      name: "(name missing)",
      email: "(email missing)",
      rsaModulus: "(rsa modulus missing)",
      rsaExponent: "(rsa exponent missing)",
      webid: webid,
      webidPresent: webid,
      imgUri: "/img/person-placeholder.png"
    }

    // subject which represents our profile
    let profile = url.parse(webid).hash

    for (var t of triples){
      if (t.predicate == FOAF.name) {
        // name
        state.name =  this.getValue(t.object)
      } else if (t.predicate == FOAF.mbox) {
        // email
        state.email =  this.getValue(t.object)
      } else if (t.predicate == FOAF.img) {
        // image uri
        state.imgUri =  this.getValue(t.object)
      } else if (t.predicate == CERT.key) {
        let key = this._parseKey(t.object, triples)
        if (key.modulus) {state.rsaModulus = this.getValue(key.modulus)}
        if (key.exponent) {state.rsaExponent = this.getValue(key.exponent)}
      }
    }
    this.setState(state)
  }

  componentDidMount() {
    console.log('profile component did mount')
    let webid = 'https://localhost:8443/reederz/profile/card#me'
    this.agent.get(webid)
      .then((result) => {
        // Parse triples from text
        let triples = []
        this.parser.parse(result.response, (err, triple, prefixes) => {
          if (triple) {
            triples.push(triple)
          } else {
            this._profileDocumentLoaded(webid, triples)
          }
        })
      })
      .catch((err) => {
        console.log('error')
        console.log(err)
      })
  }

  render() {
    let buttonText = this.state.edit ? "Save" : "Edit"

    return (
      <div className="profile">
        <div className="profile-edit">
          {buttonText}
        </div>
        { /* TODO: 2 modes: presentation and editing */ }
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
  }
}


export default Profile
