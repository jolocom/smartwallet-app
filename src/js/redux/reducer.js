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
  wallet: combineReducers({
    tabs: require('./modules/wallet/tabs').default
  })
})
