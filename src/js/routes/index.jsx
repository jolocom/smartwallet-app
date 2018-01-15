
import React from 'react'
import { Router, Route, IndexRoute } from 'react-router'

import App from 'components/app.jsx'
import Index from 'components/index.jsx'

import RegistrationEntropyScreen from
  'components/registration/screens/entropy'
import RegistrationWritePhraseScreen from
  'components/registration/screens/write-phrase'

import WalletTabsScreen from 'components/wallet/screens/tabs'
import WalletHomeScreen from 'components/wallet/screens/home'
import WalletMoneyScreen from 'components/wallet/screens/money'
import WalletIdentityScreen from 'components/wallet/screens/identity'
import WalletContactScreen from 'components/wallet/screens/contact'
import WalletEtherScreen from 'components/wallet/screens/ether-wallet'
import AccessRequestScreen
  from 'components/single-sign-on/screens/access-request'
import AccessConfirmationScreen from
  'components/single-sign-on/screens/access-confirmation'
import EmailConfirmationScreen from
'components/email-confirmation/screens/email-confirmation'

import EtherSendScreen from 'components/wallet/screens/ether-send'
import EtherReceiveScreen from 'components/wallet/screens/ether-receive'
import EtherTabScreen from 'components/wallet/screens/ether-tabs'

import WalletLogin from 'components/wallet-login'
import ExpertLoginPassphraseScreen from 'components/wallet-login/screens/phrase'

import SingleSignOnAccessRightScreen from
  'components/single-sign-on/screens/access-right'
import SingleSignOnSharedDatatScreen from
  'components/single-sign-on/screens/shared-data'
import AccountDetailsEthereumScreen from
  'components/wallet/screens/account-details-ethereum'

import EthApprovalRequestScreen from
  'components/ethereum-connect/screens/approval-request'

import {IconServices} from '../components/common'

import PasswordEntry from 'components/registration/screens/password-entry'
import PasswordPopUp from 'components/keystore/passwordPopUp'

import {
  VerificationDataScreen,
  VerificationFaceScreen,
  VerificationTransitionScreen,
  VerificationCountryScreen,
  VerificationDocumentScreen,
  VerificationResultScreen
} from 'components/verifier'

export const routes = {
  login: '/login',
  signup: '/registration',
  home: '/wallet',
  forgotPassword: '/forgot-password',
  changePassword: '/change-password',
  verifyEmail: '/verify-email',
  dapps: '/wallet/sso/access-rights'
}

export const publicRoutes = Object.values(routes)

export const navItems = [
  {
    title: 'Wallet',
    route: routes.home,
    icon: 'account_balance_wallet'
  }, {
    title: 'DApps & Services',
    route: routes.dapps,
    icon: IconServices
  }
]

function getRoutes() {
  return (<Route path="/" component={App} >
    <IndexRoute component={Index} />
    <Route path="verifier"
      component={VerificationTransitionScreen} />
    <Route path="verifier/face"
      component={VerificationFaceScreen} />
    <Route path="verifier/data"
      component={VerificationDataScreen} />
    <Route path="verifier/result"
      component={VerificationResultScreen} />
    <Route path="verifier/document"
      component={VerificationDocumentScreen} />
    <Route path="verifier/country"
      component={VerificationCountryScreen} />

    <Route path="registration"
      component={RegistrationEntropyScreen} />
    <Route path="registration/write-phrase"
      component={RegistrationWritePhraseScreen} />
    <Route path="registration/entry-password"
      component={PasswordEntry} />

    <Route path="wallet/identity/contact"
      component={WalletContactScreen} />

    <Route path="wallet/ether" component={EtherTabScreen}>
      <Route path="send" component={EtherSendScreen} />
      <IndexRoute component={WalletEtherScreen} />
      <Route path="receive" component={EtherReceiveScreen} />
    </Route>
    <Route path="wallet/account-details"
      component={AccountDetailsEthereumScreen} />

    <Route path="wallet" component={WalletTabsScreen}>
      <IndexRoute component={WalletHomeScreen} />
      <Route path="identity"
        component={WalletIdentityScreen} />
      <Route path="money"
        component={WalletMoneyScreen} />
    </Route>

    <Route path="wallet/single-sign-on/access-request"
      component={AccessRequestScreen} />
    <Route path="wallet/single-sign-on/access-confirmation"
      component={AccessConfirmationScreen} />

    <Route path="wallet/ethereum/execute-transaction"
      component={EthApprovalRequestScreen} />

    <Route path="login" component={WalletLogin} />
    <Route path="login/expert" component={ExpertLoginPassphraseScreen} />

    <Route path="verify-email" component={EmailConfirmationScreen} />
    <Route path="wallet/sso/access-rights"
      component={SingleSignOnAccessRightScreen} />
    <Route path="wallet/sso/shared-data"
      component={SingleSignOnSharedDatatScreen} />

    <Route path="wallet/keyencrypt" component={PasswordEntry} />
    <Route path="wallet/keydecrypt" component={PasswordPopUp} />
  </Route>)
}

export default (history) => {
  return (<Router history={history}>{getRoutes()}</Router>)
}
