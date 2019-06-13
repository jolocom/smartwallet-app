import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Dispatch, AnyAction } from 'redux'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions, ssoActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { StatePaymentRequestSummary } from 'src/reducers/sso'
import { showErrorScreen } from 'src/actions/generic'
import { JolocomLib } from 'jolocom-lib'
import { Linking } from 'react-native'
import { cancelSSO, clearInteractionRequest } from 'src/actions/sso'
import { JolocomRegistry } from 'jolocom-lib/js/registries/jolocomRegistry'
import { AppError, ErrorCode } from 'src/lib/errors'
import { isDeepLinkURL } from 'src/lib/util'

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
      navigationActions.navigatorReset({ routeName: routeList.PaymentConsent }),
    )
  } catch (err) {
    dispatch(showErrorScreen(new AppError(ErrorCode.PaymentRequestFailed, err)))
  } finally {
    dispatch(ssoActions.setDeepLinkLoading(false))
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

    if (isDeepLinkURL(callbackURL)) {
      const link = `${callbackURL}/${response.encode()}`
      if (await Linking.canOpenURL(link)) {
        return Linking.openURL(link).then(() => dispatch(cancelSSO()))
      } else {
        throw new Error("Cant deep link to " + callbackURL)
      }
    } else {
      return fetch(callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: response.encode() }),
        headers: { 'Content-Type': 'application/json' },
      }).then(() => dispatch(cancelSSO()))
    }
  } catch (err) {
    dispatch(clearInteractionRequest())
    dispatch(
      showErrorScreen(new AppError(ErrorCode.PaymentResponseFailed, err)),
    )
  }
}
