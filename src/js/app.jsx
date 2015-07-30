import Chat from './react/chat.jsx'
import Graph from './react/graph.jsx'
import Nav from './react/nav.jsx'
import Profile from './react/profile.jsx'

import React from 'react'

import Router from 'react-router'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router'


let App = React.createClass({  
  render() {
    return (
      <div className="nav">
        <Link to="chat">Chat</Link>
        <br/>
        <Link to="graph">Graph</Link>
        <br/>
        <Link to="nav">Nav</Link>
        <br/>
        <Link to="profile">Profile</Link>
        <RouteHandler/>
      </div>
    );
  }
});

let routes =  (
  <Route name="app" path="/" handler={App}>
    <Route name="chat" handler={Chat}/>
    <Route name="graph" handler={Graph}/>
    <Route name="nav" handler={Nav}/>
    <Route name="profile" handler={Profile}/>
  </Route>
)

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.getElementById('app'))
})
