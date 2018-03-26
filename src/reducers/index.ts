import { combineReducers } from 'redux'
import { did } from './account/'
import { seedPhrase } from './registration/'

export const rootReducer =  combineReducers({
  did,
  seedPhrase
})
