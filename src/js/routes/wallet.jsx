import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import App from 'components/app.jsx'
import Index from 'components/index.jsx'

import Login from 'components/accounts/login'
import Signup from 'components/accounts/signup'
import ForgotPassword from 'components/accounts/forgot-password'
import ChangePassword from 'components/accounts/change-password'
import Profile from 'components/accounts/profile'

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

import WalletScreen from 'components/wallet'

export const routes = {
  login: '/login',
  signup: '/registration',
  home: '/wallet',
  forgotPassword: '/forgot-password',
  changePassword: '/change-password',
  verifyEmail: '/verify-email'
}

export const publicRoutes = Object.values(routes)

export const navItems = [{
  title: 'Wallet',
  route: routes.home,
  icon: 'account_balance_wallet'
}]

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

    <Route path="wallet" component={WalletScreen} />

    <Route path="profile" component={Profile} />

    <Route path="forgot-password" component={ForgotPassword} />
    <Route path="change-password/:username/:token" component={ChangePassword} />
    <Route path="signup" component={Signup} />
    <Route path="login" component={Login} />
  </Route>)
}

export default (history) => {
  return (<Router history={history}>{getRoutes()}</Router>)
}
