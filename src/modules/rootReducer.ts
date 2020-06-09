import { combineReducers } from 'redux'

import loaderReducer from './loader/reducers'
import accountReducer from './account/reducers'
import { LoaderActions } from './loader/types'
import { AccountActionTypes } from './account/types'

const rootReducer = combineReducers({
  loader: loaderReducer,
  account: accountReducer,
})

export type RootActions = LoaderActions | AccountActionTypes

export default rootReducer
