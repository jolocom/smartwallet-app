import { combineReducers } from 'redux'

import loaderReducer from './loader/reducers'
import { LoaderActions } from './loader/types'

import accountReducer from './account/reducers'
import { AccountActions } from './account/types'

import interactionReducer from './interaction/reducer'
import { InteractionActions } from './interaction/types'

import attrsReducer from './attributes/reducer'
import { AttrActions } from './attributes/types'
import appStateReducer from './appState/reducer'
import { AppStateActions } from './appState/types'
import credentialsReducer from './credentials/reducer'
import { CredentialActions } from './credentials/types'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interaction: interactionReducer,
  attrs: attrsReducer,
  appState: appStateReducer,
  credentials: credentialsReducer,
})

export type RootActions =
  | LoaderActions
  | AccountActions
  | InteractionActions
  | AttrActions
  | AppStateActions
  | CredentialActions

export default rootReducer
