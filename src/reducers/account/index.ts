import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { Map } from 'immutable'

export interface DidState {
  readonly did: string
}

export interface ClaimState {
  readonly claims: Map<string, any>
}

export const accountReducer = combineReducers({
  did,
  claims
})
