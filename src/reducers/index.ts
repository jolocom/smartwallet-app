import { combineReducers } from 'redux'
import { registration } from './registration'
import { did } from 'src/reducers/account/'
import { seedPhrase } from 'src/reducers/registration/'

export const rootReducer =  combineReducers({
  did,
  seedPhrase,
  registration
})
