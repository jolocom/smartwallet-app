import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/'
import { seedPhrase } from 'src/reducers/registration/'

export const rootReducer =  combineReducers({
  did,
  seedPhrase
})
