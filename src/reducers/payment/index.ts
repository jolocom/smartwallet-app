import { AnyAction } from 'redux'

export interface PaymentStateSummary {
  readonly requestJWT: string
}

export interface PaymentState {
  activePaymentRequest: PaymentStateSummary
}

const initialState: PaymentState = {
  activePaymentRequest: {
    requestJWT: ''
  }
} 

// TODO: consolidate logic with SSO reducer and rename to maybe interactions
export const paymentReducer = (state = initialState, action: AnyAction ): PaymentState => {
  switch(action.type) {
    case 'SET_PAYMENT_REQUEST':
      return { activePaymentRequest: action.value }
    case 'CLEAR_PAYMENT_REQUEST':
      return initialState
    default:
      return state
  }
}
