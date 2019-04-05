import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Dispatch, AnyAction } from 'redux'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { PaymentRequest } from "jolocom-lib/js/interactionTokens/paymentRequest"
import { StatePaymentRequestSummary } from 'src/reducers/sso'
import { showErrorScreen } from '../generic'

export const setPaymentRequest = (request: StatePaymentRequestSummary) => {
  return {
    type: 'SET_PAYMENT_REQUEST',
    value: request
  }
}

export const consumePaymentRequest = (paymentRequest: JSONWebToken<PaymentRequest>) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    // const { identityWallet } = backendMiddleware

    try {
      // await identityWallet.validateJWT(paymentRequest)

      const paymentDetails: StatePaymentRequestSummary = {
        receiver: {
          did: paymentRequest.issuer,
          address: paymentRequest.interactionToken.transactionOptions.to as string
        },
        callbackURL: paymentRequest.interactionToken.callbackURL,
        amount: paymentRequest.interactionToken.transactionOptions.value,
        description: paymentRequest.interactionToken.description
      }
      dispatch(setPaymentRequest(paymentDetails))
      dispatch(navigationActions.navigate({ routeName: routeList.PaymentConsent }))
    } catch (err) {
      dispatch(showErrorScreen(new Error('Consuming payment request failed.')))
    }
  }
}
