import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/'
import { entropy } from 'src/reducers/registration/'
import { seedPhrase } from 'src/reducers/registration/'

export const rootReducer =  combineReducers({
  did,
  entropy,
  seedPhrase
})
