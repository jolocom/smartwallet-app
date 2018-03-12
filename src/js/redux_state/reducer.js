import { combineReducers } from 'redux-immutable'
import { routerReducer } from 'react-router-redux'

export default combineReducers({
  routing: routerReducer,
  confirm: require('./modules/confirmation-dialog').default,
  simpleDialog: require('./modules/simple-dialog').default,
  dialog: require('./modules/common/dialog').default,
  account: require('./modules/account').default,
  registration: require('./modules/registration').default,
  wallet: combineReducers({
    tabs: require('./modules/wallet/tabs').default,
    identityNew: require('./modules/wallet/identity-new').default
  }),
  singleSignOn: combineReducers({
    accessRequest: require('./modules/single-sign-on/access-request').default
  }),
  keystore: combineReducers({
    security: require('./modules/keystore/security').default
  }),
  verification: require('./modules/verification').default
})
