import React from 'react'

// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute } from 'react-router'

import App from 'components/app.jsx'
import Index from 'components/index.jsx'
import Graph from 'components/graph'
import Node from 'components/node/node.jsx'
import AddNode from 'components/node/add.jsx'
import Chat from 'components/chat'
import Conversations from 'components/chat/conversations'
import NewConversation from 'components/chat/conversation/new'
import Conversation from 'components/chat/conversation'
import Contacts from 'components/contacts/contacts.jsx'
import Contact from 'components/contacts/contact.jsx'

import Login from 'components/accounts/login'
import Signup from 'components/accounts/signup'
import ForgotPassword from 'components/accounts/forgot-password'
import ChangePassword from 'components/accounts/change-password'
import PrivacySettings from 'components/node/privacy-settings'
import Profile from 'components/accounts/profile'
import SharedNodes from 'components/node/shared-nodes.jsx'
import NodeList from 'components/node/node-list.jsx'
import AddContacts from 'components/node/add-contacts.jsx'

import ConfirmEmailVerification from
  'components/accounts/confirm-email-verification.jsx'

import GraphIcon from 'components/icons/graph-icon.jsx'

export const routes = {
  login: '/login',
  signup: '/signup',
  home: '/graph',
  forgotPassword: '/forgot-password',
  changePassword: '/change-password',
  verifyEmail: '/verify-email'
}

export const publicRoutes = Object.values(routes)

export const navItems = [{
  title: 'Graph',
  route: routes.home,
  icon: GraphIcon
}]

function getRoutes() {
  return (<Route path="/" component={App} >
    <IndexRoute component={Index} />
    <Route path="/chat" component={Chat}>
      <Route path="/conversations" component={Conversations}>
        <Route path="/conversations/:id" component={Conversation} />
      </Route>
      <Route path="new(/:webId)" component={NewConversation} />
      <Route path="/contacts" component={Contacts}>
        <Route path=":username" component={Contact} />
      </Route>
    </Route>
    <Route path="graph(/:node)" component={Graph} title="Graph">
      <Route path="/graph/:node/view" component={Node} />
      <Route path="/graph/:node/add/:type" component={AddNode} />
    </Route>
    <Route
      path="verify-email/:username/:code"
      component={ConfirmEmailVerification}
    />
    <Route path="profile" component={Profile} />
    <Route path="add-contacts" component={AddContacts} />
    <Route path=":uri/privacy-settings" component={PrivacySettings} />
    <Route path=":uri/shared-nodes" component={SharedNodes} />
    <Route path="node-list" component={NodeList} />
    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="change-password/:username/:token" component={ChangePassword} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
  </Route>)
}

export default (history) => {
  return (<Router history={history}>{getRoutes()}</Router>)
}
