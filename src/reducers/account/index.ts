import { combineReducers } from 'redux'
import { did } from 'src/reducers/account/did'
import { claims } from 'src/reducers/account/claims'
import { Map } from 'immutable'
import { Claims } from 'src/ui/home/components/claimOverview'

// TODO: move to claims reducer and connect
interface CState {
  loading: boolean
  selected: {id: number | string, claimField: string}
  savedClaims: Claims
}

export interface DidState {
  readonly did: string
}

export interface ClaimState {
  readonly claims: Map<string, CState>
}

export interface AccountState {
  did: DidState,
  claims: ClaimState
}

export const accountReducer = combineReducers({
  did,
  claims
})
