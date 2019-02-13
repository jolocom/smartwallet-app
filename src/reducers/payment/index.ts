import { AnyAction } from 'redux'
import { ITransactionDetailsPaymentRequest } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export interface PaymentStateSummary {
  readonly transactionDetails:  ITransactionDetailsPaymentRequest
  readonly requestJWT: string
  readonly description: string
  readonly didRequester: string
  readonly callbackURL?: string
}

export interface PaymentState {
  activePaymentRequest: PaymentStateSummary
}

const initialState: PaymentState = {
  activePaymentRequest: {
    requestJWT: '',
    transactionDetails: {
      receiverAddress: '',
      amountInEther: ''
    },
    description: '',
    didRequester: ''
  }
} 

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
