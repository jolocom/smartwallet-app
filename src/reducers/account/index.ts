import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'

export interface Claim {
  id: string
  type?: string
  value: any
}

export interface DecoratedClaims {
  displayName: string
  claims: Claim[]
}

type CategorizedClaims = Map<string, DecoratedClaims[]>

export interface ClaimsState {
  readonly loading: boolean
  readonly selected: SelectedState
  readonly claims: CategorizedClaims
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
