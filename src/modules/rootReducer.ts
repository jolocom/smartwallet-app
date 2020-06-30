import { combineReducers } from 'redux'

import loaderReducer from './loader/reducers'
import { LoaderActions } from './loader/types'
import accountReducer from './account/reducers'
import { AccountActionTypes } from './account/types'
import interactionReducer from './interaction/reducer'
import { InteractionActions } from './interaction/types'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interaction: interactionReducer,
})

export type RootActions =
  | LoaderActions
  | AccountActionTypes
  | InteractionActions

export default rootReducer
