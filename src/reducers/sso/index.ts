import { AnyAction } from 'redux'

export interface StateVerificationSummary {
  id: string
  issuer: string
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
  readonly requester: string
  readonly availableCredentials: StateTypeSummary[]
  readonly requestJWT: string
}

export interface SsoState {
  activeCredentialRequest: StateCredentialRequestSummary
}

const initialState: SsoState = {
  activeCredentialRequest: {
    requester: '',
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
      return { activeCredentialRequest: action.value }
    case 'CLEAR_CREDENTIAL_REQUEST':
      return initialState
    default:
      return state
  }
}
