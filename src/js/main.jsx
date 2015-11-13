import React from 'react'
import ReactDOM from 'react-dom'

// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import Router, { Route } from 'react-router'

//import injectTapEventPlugin from 'react-tap-event-plugin'

import App from 'components/app.jsx'
import Graph from 'components/graph/graph.jsx'
import Node from 'components/node/node.jsx'
import AddNode from 'components/node/add.jsx'
import Chat from 'components/chat/chat.jsx'
import ChatNew from 'components/chat/new.jsx'
import Conversation from 'components/chat/conversation.jsx'
import Contacts from 'components/contacts/contacts.jsx'
import Contact from 'components/contacts/contact.jsx'
import Projects from 'components/projects/projects.jsx'

import LoginDev from 'components/accounts/login-dev.jsx'
import Test from 'components/test.jsx'
//import SignupProd from 'components/signup.jsx'
import Signup from 'components/accounts/signup-dev.jsx'

// chat to quiclky implement chat functionality- should be refactored
import ChatTest from 'components/chat-test.jsx'

// injectTapEventPlugin()
//
import moment from 'moment'

moment.locale('en', {
  relativeTime : {
    future: 'in %s',
    past: function (number/*, withoutSuffix, key, isFuture*/) {
      // console.log(number, withoutSuffix, key, isFuture)
      return number
    },
    s: 'just now',
    m: '1m',
    mm: '%dm',
    h:  '1h',
    hh: '%dh',
    d:  '1d',
    dd: '%ddays',
    M:  '1m',
    MM: '%dm',
    y:  '1y',
    yy: '%dy'
  }
})

let routes = (
  <Route path='/' component={App}>
    <Route path='graph(/:node)' component={Graph} title='Graph'>
      <Route path='/graph/:node/add/:type' component={AddNode}/>
      <Route path='/graph/:node/details' component={Node}/>
    </Route>
    <Route path='chat' component={Chat}>
      <Route path='new' component={ChatNew}/>
      <Route path='/conversations/:id' component={Conversation}/>
    </Route>
    <Route path='contacts' component={Contacts}>
      <Route path=':username' component={Contact}/>
    </Route>
    <Route path='projects' component={Projects}/>
    <Route path='signup' component={Signup}/>
    <Route name='login' component={LoginDev}/>
    <Route path='test' component={Test}/>
    <Route path='chat-test' component={ChatTest}/>
  </Route>
)

ReactDOM.render(<Router>{routes}</Router>, document.getElementById('app'))
