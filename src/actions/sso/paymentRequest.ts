import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { JolocomLib } from 'jolocom-lib'
import { Linking } from 'react-native'
import { cancelSSO } from 'src/actions/sso'
import { ThunkDispatch } from '../../store'
import { RootState } from '../../reducers'
import { BackendMiddleware } from '../../backendMiddleware'
import { AppError } from '../../lib/errors'
import ErrorCode from '../../lib/errorCodes'
import { IdentitySummary, PaymentRequestSummary } from './types'

export const formatPaymentRequest = (
  paymentRequest: JSONWebToken<PaymentRequest>,
  requester: IdentitySummary,
): PaymentRequestSummary => ({
  receiver: {
    did: paymentRequest.issuer,
    address: paymentRequest.interactionToken.transactionOptions.to as string,
  },
  requester,
  callbackURL: paymentRequest.interactionToken.callbackURL,
  amount: paymentRequest.interactionToken.transactionOptions.value,
  description: paymentRequest.interactionToken.description,
  requestJWT: paymentRequest.encode(),
})

export const sendPaymentResponse = (
  isDeepLinkInteraction: boolean,
  paymentDetails: PaymentRequestSummary,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet } = backendMiddleware
  const { callbackURL, requestJWT } = paymentDetails

  // add loading screen here
  const password = await backendMiddleware.keyChainLib.getPassword()
  const decodedPaymentRequest = JolocomLib.parse.interactionToken.fromJWT<
    PaymentRequest
  >(requestJWT)
  const txHash = await identityWallet.transactions.sendTransaction(
    decodedPaymentRequest.interactionToken,
    password,
  )
  const response = await identityWallet.create.interactionTokens.response.payment(
    { txHash },
    password,
    decodedPaymentRequest,
  )

  if (isDeepLinkInteraction) {
    const callback = `${callbackURL}/${response.encode()}`
    if (!(await Linking.canOpenURL(callback))) {
      throw new AppError(ErrorCode.DeepLinkUrlNotFound)
    }

    return Linking.openURL(callback).then(() => dispatch(cancelSSO))
  } else {
    return fetch(callbackURL, {
      method: 'POST',
      body: JSON.stringify({ token: response.encode() }),
      headers: { 'Content-Type': 'application/json' },
    }).then(() => dispatch(cancelSSO))
  }
}
