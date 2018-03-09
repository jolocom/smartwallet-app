import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  routing: routerReducer,
  confirm: require('./modules/confirmation-dialog').default,
  simpleDialog: require('./modules/simple-dialog').default,
  dialog: require('./modules/common/dialog').default,
  snackBar: require('./modules/snack-bar').default,
  account: require('./modules/account').default,
  registration: require('./modules/registration').default,
  leftNav: require('./modules/left-nav').default,
  walletLogin: require('./modules/wallet-login').default,
  wallet: combineReducers({
    tabs: require('./modules/wallet/tabs').default,
    etherTabs: require('./modules/wallet/ether-tabs').default,
    contact: require('./modules/wallet/contact').default,
    identity: require('./modules/wallet/identity').default,
    identityNew: require('./modules/wallet/identity-new').default,
    country: require('./modules/wallet/country-select').default,
    money: require('./modules/wallet/money').default
  }),
  singleSignOn: combineReducers({
    accessRequest: require('./modules/single-sign-on/access-request').default
  }),
  keystore: combineReducers({
    security: require('./modules/keystore/security').default
  }),
  verification: require('./modules/verification').default,
  ethereumConnect: require('./modules/ethereum-connect').default
})
