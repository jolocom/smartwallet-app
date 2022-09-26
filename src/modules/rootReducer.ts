import { combineReducers } from 'redux'
import accountReducer from './account/reducers'
import appStateReducer from './appState/reducer'
import attrsReducer from './attributes/reducer'
import credentialsReducer from './credentials/reducer'
import interactionReducer from './interaction/reducer'
import loaderReducer from './loader/reducers'
import toastsReducer from './toasts/reducer'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interaction: interactionReducer,
  attrs: attrsReducer,
  appState: appStateReducer,
  credentials: credentialsReducer,
  toasts: toastsReducer,
})

export default rootReducer
