import React from 'react'
// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import Router, { Route, Redirect } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from 'components/app.jsx'
import Graph from 'components/graph/graph.jsx'
import Pinned from 'components/graph/pinned.jsx'
import Node from 'components/node/node.jsx'
import Chat from 'components/chat/chat.jsx'
import Contacts from 'components/contacts/contacts.jsx'
import Projects from 'components/projects/projects.jsx'

import LoginDev from 'components/accounts/login-dev.jsx'
import Test from 'components/test.jsx'
//import SignupProd from 'components/signup.jsx'
import Signup from 'components/accounts/signup-dev.jsx'

injectTapEventPlugin()

let routes = (
  <Route path="/" component={App}>
    <Redirect from="/" to="/graph" />
    <Route path="graph" component={Graph} title="Graph">
      <Route path="pinned" component={Pinned}/>
      <Route path="n/:node" component={Node}/>
    </Route>
    <Route path="chat" component={Chat}/>
    <Route path="contacts" component={Contacts}/>
    <Route path="projects" component={Projects}/>
    <Route path="signup" component={Signup}/>
    <Route name="login" component={LoginDev}/>
    <Route path="test" component={Test}/>
  </Route>
)

React.render(<Router>{routes}</Router>, document.body)
