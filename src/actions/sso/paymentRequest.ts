import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Dispatch, AnyAction } from 'redux'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { StatePaymentRequestSummary } from 'src/reducers/sso'
import { showErrorScreen } from 'src/actions/generic'
import { JolocomLib } from 'jolocom-lib'
import { Linking } from 'react-native'
import { cancelSSO } from 'src/actions/sso'
import { JolocomRegistry } from 'jolocom-lib/js/registries/jolocomRegistry'

export const setPaymentRequest = (request: StatePaymentRequestSummary) => ({
  type: 'SET_PAYMENT_REQUEST',
  value: request,
})

export const consumePaymentRequest = (
  paymentRequest: JSONWebToken<PaymentRequest>,
) => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet, registry } = backendMiddleware

  try {
    await identityWallet.validateJWT(
      paymentRequest,
      undefined,
      registry as JolocomRegistry,
    )

    const paymentDetails: StatePaymentRequestSummary = {
      receiver: {
        did: paymentRequest.issuer,
        address: paymentRequest.interactionToken.transactionOptions
          .to as string,
      },
      callbackURL: paymentRequest.interactionToken.callbackURL,
      amount: paymentRequest.interactionToken.transactionOptions.value,
      description: paymentRequest.interactionToken.description,
      paymentRequest: paymentRequest.encode(),
    }
    dispatch(setPaymentRequest(paymentDetails))
    dispatch(
      navigationActions.navigate({ routeName: routeList.PaymentConsent }),
    )
  } catch (err) {
    dispatch(showErrorScreen(new Error('Consuming payment request failed.')))
  }
}

export const sendPaymentResponse = () => async (
  dispatch: Dispatch<AnyAction>,
  getState: Function,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet } = backendMiddleware
  const {
    activePaymentRequest: { callbackURL, paymentRequest },
  } = getState().sso
  // add loading screen here
  try {
    const password = await backendMiddleware.keyChainLib.getPassword()
    const decodedPaymentRequest = JolocomLib.parse.interactionToken.fromJWT<
      PaymentRequest
    >(paymentRequest)
    const txHash = await identityWallet.transactions.sendTransaction(
      decodedPaymentRequest.interactionToken,
      password,
    )
    const response = await identityWallet.create.interactionTokens.response.payment(
      { txHash },
      password,
      decodedPaymentRequest,
    )

    if (callbackURL.includes('http')) {
      await fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: response.encode() }),
        headers: { 'Content-Type': 'application/json' },
      })
    } else {
      const url = callbackURL + response.encode()
      Linking.openURL(url)
    }
    dispatch(cancelSSO())
  } catch (err) {
    console.log(err)
    dispatch(showErrorScreen(new Error('Sending payment response failed.')))
  }
}
