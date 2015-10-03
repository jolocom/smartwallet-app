import React from 'react'
// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import Router, { Route, Redirect } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from 'components/app.jsx'
import Graph from 'components/graph.jsx'
import Node from 'components/graph/node.jsx'
import Chat from 'components/chat.jsx'
import Signup from 'components/signup.jsx'
import Test from 'components/test.jsx'

injectTapEventPlugin()

let routes = (
  <Route path="/" component={App}>
    <Redirect from="" to="/graph" />
    <Route path="graph" component={Graph}>
      <Route path=":node" component={Node}/>
    </Route>
    <Route path="chat" component={Chat}/>
    <Route path="signup" component={Signup}/>
    <Route path="test" component={Test}/>
  </Route>
)

React.render(<Router>{routes}</Router>, document.body)
