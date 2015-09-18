import React from 'react'
import Router, { Route, DefaultRoute } from 'react-router'

import injectTapEventPlugin from 'react-tap-event-plugin'

import App from 'components/app.jsx'
import Graph from 'components/graph.jsx'
import Chat from 'components/chat.jsx'
import Signup from 'components/signup.jsx'

injectTapEventPlugin()

let routes =  (
  <Route name="app" path="/" handler={App}>
    <DefaultRoute handler={Graph} />
    <Route name="graph" handler={Graph}/>
    <Route name="chat" handler={Chat}/>
    <Route name="signup" handler={Signup}/>
  </Route>
)

Router.run(routes, (Handler) => {
  React.render(<Handler/>, document.body)
})
