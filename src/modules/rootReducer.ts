import { combineReducers } from 'redux'

import loaderReducer from './loader/reducers'
import accountReducer from './account/reducers'
import interactionsReducer from './interactions/reducers'
import { LoaderActions } from './loader/types'
import { AccountActionTypes } from './account/types'
import { InteractionsActionTypes } from './interactions/types'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
  interactions: interactionsReducer,
})

export type RootActions =
  | LoaderActions
  | AccountActionTypes
  | InteractionsActionTypes

export default rootReducer
