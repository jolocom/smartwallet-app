import React from 'react'
import WebAgent from '../lib/web-agent.js'
import N3 from 'n3'
import {FOAF} from '../lib/namespaces.js'

let Nav = React.createClass({
  getInitialState: function() {
    return {
      imgUri: '/img/person-placeholder.png'
    }
  },
  _profileDocumentLoaded: function (webid, triples, prefixes) {
    let state = {
      imgUri: '/img/person-placeholder.png'
    }

    let found = false
    // triples which describe profile
    let relevant = triples.filter((t) => t.subject == webid) 

    // get foaf:img
    for (var t of relevant){
      if (t.predicate == FOAF.img) {
        state.imgUri =  t.object
        found = true
        break
      }    
    }
    if (found) {
      this.setState(state)
    }
  },
  componentDidMount: function() {
    console.log('nav bar did mount')
    var webid = null

    // who am I? (check "User" header)
    WebAgent.head(document.location.origin)
      .then((xhr) => {
        console.log('head')
        console.log(xhr)
        webid = xhr.getResponseHeader('User')
        console.log('webid')
        console.log(webid)

        // now get my profile document
        return WebAgent.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let triples = []
        let parser = N3.Parser()
        parser.parse(xhr.response, (err, triple, prefixes) => {
          if (triple) {
            triples.push(triple)
          } else {
            // render relevant information in UI
            this._profileDocumentLoaded(webid, triples, prefixes)
          }
        })
      })
      .catch((err) => {
        console.log('error')
        console.log(err)
      })
  },
  
  render: function() {
    return (
      <div className="status-bar">
        <img className="status-bar-img" src={this.state.imgUri}/>
        <span className="status-bar-text">You are logged in as </span>
        <a className="status-bar-profile-link" href="/#/profile">foo</a>
        <span className="status-bar-graph-text"> Here is your </span>
        <a className="status-bar-graph-link" href="/#/graph">graph</a>
      </div>
    )
  }
})


export default Nav
