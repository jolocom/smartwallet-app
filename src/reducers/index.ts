import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/'
import { seedPhrase } from 'src/reducers/registration/'
import { navigation } from 'src/reducers/navigation/'

export const rootReducer =  combineReducers({
  did,
  seedPhrase,
  navigation
})
