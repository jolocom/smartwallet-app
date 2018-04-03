import { combineReducers } from 'redux'
import { registration } from './registration/loading'
import { did } from 'src/reducers/account/'
import { seedPhrase } from 'src/reducers/registration/seedPhrase'

export const rootReducer =  combineReducers({
  did,
  seedPhrase,
  registration
})
