import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'

export interface Claim {
  id: string
  value: any
}

export interface DecoratedClaims {
  displayName: string
  type: string[]
  claims: Claim[]
}

export type CategorizedClaims = Map<string, DecoratedClaims[]>

export interface ClaimsState {
  readonly loading: boolean
  readonly selected: DecoratedClaims
  readonly claims: CategorizedClaims
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
