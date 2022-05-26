import { combineReducers } from 'redux'
import loaderReducer from './loader/reducers'
import accountReducer from './account/reducers'
import interactionReducer from './interaction/reducer'
import attrsReducer from './attributes/reducer'
import appStateReducer from './appState/reducer'
import credentialsReducer from './credentials/reducer'
import toastsReducer from './toasts/reducer'
import mdlReducer from './mdl/reducer'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interaction: interactionReducer,
  attrs: attrsReducer,
  appState: appStateReducer,
  credentials: credentialsReducer,
  toasts: toastsReducer,
  mdl: mdlReducer,
})

export default rootReducer
