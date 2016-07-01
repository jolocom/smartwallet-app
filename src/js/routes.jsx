import React from 'react'

// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import Router, { Route, IndexRoute } from 'react-router'

import App from 'components/app.jsx'
import Index from 'components/index.jsx'
import Graph from 'components/graph/graph.jsx'
import Node from 'components/node/node.jsx'
import AddNode from 'components/node/add.jsx'
import Chat from 'components/chat/chat.jsx'
import Conversations from 'components/chat/conversations.jsx'
import ChatNew from 'components/chat/new.jsx'
import Conversation from 'components/chat/conversation.jsx'
import Contacts from 'components/contacts/contacts.jsx'
import Contact from 'components/contacts/contact.jsx'

import Login from 'components/accounts/login.jsx'
import Signup from 'components/accounts/signup.jsx'

const routes = (
  <Route path='/' component={App}>
    <IndexRoute component={Index}/>
    <Route path='graph(/:node)' component={Graph} title='Graph'>
      <Route path='/graph/:node/add/:type' component={AddNode}/>
      <Route path='/graph/:node/details' component={Node}/>

      <Route path='/chat' component={Chat}>
        <IndexRoute component={Conversations}/>
        <Route path='new' component={ChatNew}/>
        <Route path='/conversations/:id' component={Conversation}/>
        <Route path='/contacts' component={Contacts}>
          <Route path=':username' component={Contact}/>
        </Route>
      </Route>
    </Route>
    <Route path='signup' component={Signup}/>
    <Route path='login' component={Login}/>
  </Route>
)

export default () => {
  return (<Router>{routes}</Router>)
}
