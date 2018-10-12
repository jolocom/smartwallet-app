import { AnyAction } from 'redux'

export interface StateAttributeSummary {
  value: string
  verifications: StateVerificationSummary[]
}

export interface StateVerificationSummary {
  id: string
  issuer: string
  selfSigned: boolean
  expires: string | undefined
}
export interface StateTypeSummary {
  type: string[]
  credentials: StateAttributeSummary[]
}

export interface StateCredentialRequestSummary {
  readonly callbackURL: string
  // readonly requester: string
  readonly request: StateTypeSummary[]
}

export interface SsoState {
  activeCredentialRequest: StateCredentialRequestSummary
}

const initialState: SsoState = {
  activeCredentialRequest: {
    // requester: '',
    callbackURL: '',
    request: []
  }
}

export const ssoReducer = (state = initialState, action: AnyAction): SsoState => {
  switch(action.type) {
    case 'SET_CREDENTIAL_REQUEST':
      return { activeCredentialRequest: action.value }
    case 'CLEAR_CREDENTIAL_REQUEST':
      return initialState
    default:
      return state
  }
}