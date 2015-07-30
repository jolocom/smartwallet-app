import Hello from './react/hello.jsx'
import Other from './react/other.jsx'
import React from 'react'
import Router from 'react-router'
import { DefaultRoute, Link, Route, RouteHandler } from 'react-router'

let App = React.createClass({  
  render() {
    return (
      <div className="nav">
        <Link to="hello">Hello</Link>
        <br/>
        <Link to="other">Other</Link>

        <RouteHandler/>
      </div>
    );
  }
});

let routes =  (
  <Route name="app" path="/" handler={App}>
    <Route name="hello" handler={Hello}/>
    <Route name="other" handler={Other}/>
  </Route>
)

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.getElementById('app'))
})
