import React from 'react'
import WebIDAgent from '../lib/agents/webid.js'
import {FOAF} from '../lib/namespaces.js'
import {Parser} from '../lib/rdf.js'

let wia = new WebIDAgent()

let Nav = React.createClass({
  getInitialState: function() {
    return {
      imgUri: '/img/person-placeholder.png'
    }
  },
  _profileDocumentLoaded: function (webid, triples) {
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

    wia.getWebID()
      .then((user) => {
        webid = user
        return wia.get(webid)
      })
      .then((xhr) => {
        // parse profile document from text
        let parser = new Parser()
        return parser.parse(xhr.response)

      })
      .then((res) => {
        // render relevant information in UI
        this._profileDocumentLoaded(webid, res.triples)

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
