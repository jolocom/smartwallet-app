import { combineReducers } from 'redux'

import loaderReducer from './loader/reducers'
import { LoaderActions } from './loader/types'

import accountReducer from './account/reducers'
import { AccountActions } from './account/types'

import interactionReducer from './interaction/reducer'
import { InteractionActions } from './interaction/types'

import appStateReducer from './appState/reducer'
import { AppStateActions } from './appState/actions'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interaction: interactionReducer,
  appState: appStateReducer,
})

export type RootActions =
  | LoaderActions
  | AccountActions
  | InteractionActions
  | AppStateActions

export default rootReducer
