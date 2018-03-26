import { combineReducers } from 'redux'
import { did } from './account'
import { registration } from './registration'

export const rootReducer =  combineReducers({
  did,
  registration
})
