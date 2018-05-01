import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'

export interface AccountState {
  readonly did: string
}

export const accountReducer = combineReducers({
  did
})
