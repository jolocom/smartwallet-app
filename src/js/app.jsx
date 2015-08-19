import Graph from './react/graph.jsx'
import Nav from './react/nav.jsx'
import Profile from './react/profile.jsx'

import React from 'react'

import Router from 'react-router'
import { Route, RouteHandler } from 'react-router'


let App = React.createClass({  
  render() {
    return (
      <div id="page">
        <Nav/>
        <RouteHandler/>
      </div>
    )
  }
})

let routes =  (
  <Route name="app" path="/" handler={App}>
    <Route name="graph" handler={Graph}/>
    <Route name="profile" handler={Profile}/>
  </Route>
)

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.body)
})
