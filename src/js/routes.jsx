import React from 'react'

// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute, hashHistory } from 'react-router'

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
import Groups from 'components/groups/groups.jsx'
import GroupsNew from 'components/groups/new.jsx'
import Contact from 'components/contacts/contact.jsx'

import Login from 'components/accounts/login.jsx'
import Signup from 'components/accounts/signup.jsx'
import ForgotPassword from 'components/accounts/forgot-password'
import ChangePassword from 'components/accounts/change-password'
import PrivacySettings from 'components/node/privacy-settings.jsx'
import Profile from 'components/accounts/profile.jsx'
import SharedNodes from 'components/node/shared-nodes.jsx'
import NodeList from 'components/node/node-list.jsx'

const routes = (
  <Route path="/" component={App} >
    <IndexRoute component={Index} />
    <Route path="/chat" component={Chat}>
      <Route path="/conversations" component={Conversations}>
        <Route path="/conversations/:id" component={Conversation} />
      </Route>
      <Route path="new(/:webId)" component={ChatNew} />
      <Route path="/groups" component={Groups}>
        <Route path="/groups/new" component={GroupsNew} />
      </Route>
      <Route path="/contacts" component={Contacts}>
        <Route path=":username" component={Contact} />
      </Route>
    </Route>
    <Route path="graph(/:node)" component={Graph} title="Graph">
      <Route path="/graph/:node/view" component={Node} />
      <Route path="/graph/:node/add/:type" component={AddNode} />
    </Route>
    <Route path="profile" component={Profile} />
    <Route path=":uri/privacy-settings" component={PrivacySettings} />
    <Route path=":uri/shared-nodes" component={SharedNodes} />
    <Route path="node-list" component={NodeList} />
    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="change-password/:username/:token" component={ChangePassword} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
  </Route>
)

export default () => {
  return (<Router history={hashHistory}>{routes}</Router>)
}
