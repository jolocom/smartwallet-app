import React from 'react'
import Chat from './chat.jsx'
import WebAgent from '../lib/web-agent.js'
import N3 from 'n3'

let parser = N3.Parser()
let N3Util = N3.Util
let agent = new WebAgent()
console.log(agent)
let url = 'https://localhost:8443/reederz/profile/card#me'
agent.get(url)
  .then((result) => {
    console.log('success')
    console.log(result)
    parser.parse(result.response, (err, triple, prefixes) => {
      if (triple) {
        console.log(triple)
        console.log(N3Util.isLiteral(triple.object))
      } else {
        console.log(prefixes)
      }
      if (err) {
        console.log('error')
        console.log(err)
      }
    })
  })
  .catch((err) => {
    console.log('error')
    console.log(err)
  })

class Graph extends React.Component {

  render() {
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
        <div id="chat_container">
          <Chat/>
        </div>
      </div>
    )
  }
}


export default Graph
