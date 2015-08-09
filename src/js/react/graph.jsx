import React from 'react/addons'
import Chat from './chat.jsx'

import url from 'url'
import N3 from 'n3'
import D3Converter from '../lib/d3-converter.js'
import WebAgent from '../lib/web-agent.js'

let agent = new WebAgent()

let Graph = React.createClass({
  _drawGraph: function(center, triples, prefixes) {
    console.log('drawing graph')
    let d3graph = D3Converter.convertTriples(center, triples)
    console.log('result')
    console.log(d3graph)
  },
  componentDidMount: function() {
    console.log('graph component did mount')
    var webid = null

    // who am I? (check "User" header)
    agent.head(document.location.origin)
      .then((xhr) => {
        console.log('head')
        console.log(xhr)
        webid = xhr.getResponseHeader('User')

        // now get my profile document
        return agent.get(webid)
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
            this._drawGraph(webid, triples, prefixes)
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
      <div id="graph-outer">
        { /* TODO: structure, ids and class names suck*/ }
        <div id="wrapper">
          <input id="graph-url" type="text" hidden="hidden"/>
          { /* TODO: probably don't need this hidden stuff anymore */ }
          <input id="chat-state" type="text" hidden="hidden"/>

          <div id="plus_button"/>
          <div id="plus_drawer">
            <div className="close">x</div>
            <div>
              <textarea className="title" placeholder="Node title" rows="1" cols="50"/>
            </div>
            <div>
              <textarea className="description" placeholder="Node description" rows="5" cols="50"/>
            </div>
            <div className="button direct">Connect Now</div>
            <div className="button inbox">Put Into Inbox</div>
          </div>
          <div id="inbox" draggable="true">
            <div className="counter">
              <div className="number">1</div>
            </div>
          </div>
          <div id="inbox_large">
            <div className="close">x</div>
          </div>
          <div id="graph">
            <div id="chart"/>
          </div>
        </div>
        {
        /* <div id="chat_container">
          <Chat/>
        </div>
        */
        }
      </div>
    )
  }
})


export default Graph
