import React from 'react'

// @TODO preferred way to handle history, can we do this with gold server?
// import createBrowserHistory from 'history/lib/createBrowserHistory'
import { Router, Route, IndexRoute } from 'react-router'

import App from 'components/app.jsx'
import Index from 'components/index.jsx'
import Graph from 'components/graph/graph.jsx'
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
import ConfirmEmailVerification from
  'components/accounts/confirm-email-verification.jsx'

import RegistrationNameEntryScreen from
  'components/registration/screens/name-entry'
import RegistrationEntropyScreen from
  'components/registration/screens/entropy'
import RegistrationUserTypeScreen from
  'components/registration/screens/user-type'
import RegistrationWritePhraseScreen from
  'components/registration/screens/write-phrase'
import RegistrationPhraseInfoScreen from
  'components/registration/screens/phrase-info'
import RegistrationPinScreen from
  'components/registration/screens/pin'
import RegistrationIdentifierScreen from
  'components/registration/screens/identifier'
import RegistrationPasswordScreen from
  'components/registration/screens/password'

function getRoutes() {
  return (<Route path="/" component={App} >
    <IndexRoute component={Index} />

    <Route path="/registration"
      component={RegistrationNameEntryScreen} />
    <Route path="/registration/entropy"
      component={RegistrationEntropyScreen} />
    <Route path="/registration/user-type"
      component={RegistrationUserTypeScreen} />
    <Route path="/registration/write-phrase"
      component={RegistrationWritePhraseScreen} />
    <Route path="/registration/phrase-info"
      component={RegistrationPhraseInfoScreen} />
    <Route path="/registration/pin"
      component={RegistrationPinScreen} />
    <Route path="/registration/email"
      component={RegistrationIdentifierScreen} />
    <Route path="/registration/password"
      component={RegistrationPasswordScreen} />

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
