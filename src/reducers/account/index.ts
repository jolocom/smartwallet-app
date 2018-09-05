import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { loading } from 'src/reducers/account/loading'


export interface Claim {
  id: string
  name: string
  value: any
}

export interface DecoratedClaims {
  displayName: string
  type: string[]
  claims: Claim[]
}

export interface CategorizedClaims {
  readonly [key: string]: DecoratedClaims[]
}

export interface ClaimsState {
  readonly loading: boolean
  readonly selected: DecoratedClaims
  readonly decoratedCredentials: CategorizedClaims
}

export interface DidState {
  readonly did: string
}

export interface LoadingState {
  readonly loading: boolean
}

// TODO avoid state.account.did.did access patterns
export interface AccountState {
  did: DidState,
  claims: ClaimsState,
  loading: LoadingState
}

export const accountReducer = combineReducers({
  did,
  claims,
  loading
})
