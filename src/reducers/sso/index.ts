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

export interface StatePaymentRequestSummary {
  receiver: {
    did: string
    address: string
  }
  callbackURL: string
  amount: number
  description: string
  paymentRequest: string
}

export interface StateAuthenticationRequestSummary {
  callbackURL: string
  did: string
  requestJWT: string
}

export interface SsoState {
  activeCredentialRequest: StateCredentialRequestSummary
  activePaymentRequest: StatePaymentRequestSummary
  activeAuthenticationRequest: StateAuthenticationRequestSummary
}

const initialState: SsoState = {
  activeCredentialRequest: {
    requester: '',
    callbackURL: '',
    availableCredentials: [],
    requestJWT: '',
  },
  activePaymentRequest: {
    receiver: {
      did: '',
      address: '',
    },
    callbackURL: '',
    amount: 0,
    description: '',
    paymentRequest: '',
  },
  // add blank authentication request, which is did, public profile?
  activeAuthenticationRequest: {
    did: '',
    callbackURL: '',
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
    case 'SET_PAYMENT_REQUEST':
      return { ...state, activePaymentRequest: action.value }
    case 'SET_AUTHENTICATION_REQUEST':
      return { ...state, activeAuthenticationRequest: action.value }
    case 'CLEAR_INTERACTION_REQUEST':
      return initialState
    default:
      return state
  }
}
