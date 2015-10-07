import React from 'react'
import Router, { Route, DefaultRoute } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from 'components/app.jsx'
import Graph from 'components/graph.jsx'
import Chat from 'components/chat.jsx'
import LoginDev from 'components/login-dev.jsx'
import Test from 'components/test.jsx'
//import SignupProd from 'components/signup.jsx'
import Signup from 'components/signup-dev.jsx'

injectTapEventPlugin()

let routes =  (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Graph} />
    <Route name="graph" handler={Graph}/>
    <Route name="chat" handler={Chat}/>
    <Route name="signup" handler={Signup}/>
    <Route name="login" handler={LoginDev}/>
    <Route name="test" handler={Test}/>
  </Route>
)

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.body)
})
