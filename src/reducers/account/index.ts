import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { Claims } from 'src/actions/account/helper'

export interface ClaimsState {
  readonly loading: boolean
  readonly selected: SelectedState   
  readonly savedClaims: Claims
}

interface SelectedState {
	readonly id: string
}

export interface DidState {
  readonly did: string
}

export interface AccountState {
  did: DidState,
  claims: ClaimsState
}

export const accountReducer = combineReducers({
  did,
  claims
})
