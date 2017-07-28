import { combineReducers } from 'redux-immutable'
// import multireducer from 'multireducer'
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
    contact: require('./modules/wallet/contact').default,
    identity: require('./modules/wallet/identity').default,
    country: require('./modules/wallet/country-select').default,
    money: require('./modules/wallet/money').default,
    idCard: require('./modules/wallet/id-card').default
  }),
  singleSignOn: combineReducers({
    accessRight: require('./modules/single-sign-on/access-right').default
  }),
  verification: require('./modules/verification').default
})
