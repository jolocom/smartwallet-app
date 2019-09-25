import { AnyAction } from 'redux'
import { IdentitySummary } from '../../actions/sso/types'

export interface StateVerificationSummary {
  id: string
  issuer: IdentitySummary
  selfSigned: boolean
  expires: string | undefined | Date
}

export interface StateTypeSummary {
  type: string
  values: string[]
  verifications: StateVerificationSummary[]
}

export interface StateCredentialRequestSummary {
  readonly callbackURL: string
  readonly requester: IdentitySummary
  readonly availableCredentials: StateTypeSummary[]
  readonly requestJWT: string
}

export interface SsoState {
  activeCredentialRequest: StateCredentialRequestSummary
}

export const initialState: SsoState = {
  activeCredentialRequest: {
    requester: {
      did: '',
    },
    callbackURL: '',
    availableCredentials: [],
    requestJWT: '',
  },
}

export const ssoReducer = (
  state = initialState,
  action: AnyAction,
): SsoState => {
  switch (action.type) {
    case 'SET_CREDENTIAL_REQUEST':
      return { ...state, activeCredentialRequest: action.value }
    case 'CLEAR_INTERACTION_REQUEST':
      return initialState
    default:
      return state
  }
}
