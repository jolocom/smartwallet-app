import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { JolocomLib } from 'jolocom-lib'
import { cancelSSO } from 'src/actions/sso'
import { JolocomRegistry } from 'jolocom-lib/js/registries/jolocomRegistry'
import { ThunkDispatch } from '../../store'
import { RootState } from '../../reducers'
import { BackendMiddleware } from '../../backendMiddleware'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { generateIdentitySummary } from './utils'
import { PaymentRequestSummary } from './types'
import { SendResponse } from 'src/lib/transportLayers';

export const consumePaymentRequest = (
  paymentRequest: JSONWebToken<PaymentRequest>,
  send: SendResponse,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet, registry } = backendMiddleware

  await identityWallet.validateJWT(
    paymentRequest,
    undefined,
    registry as JolocomRegistry,
  )

  const requester = await registry.resolve(keyIdToDid(paymentRequest.issuer))

  const requesterSummary = generateIdentitySummary(requester)

  const paymentDetails: PaymentRequestSummary = {
    receiver: {
      did: paymentRequest.issuer,
      address: paymentRequest.interactionToken.transactionOptions.to as string,
    },
    requester: requesterSummary,
    callbackURL: paymentRequest.interactionToken.callbackURL,
    amount: paymentRequest.interactionToken.transactionOptions.value,
    description: paymentRequest.interactionToken.description,
    requestJWT: paymentRequest.encode(),
  }
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.PaymentConsent,
      params: { send, paymentDetails },
      key: 'paymentRequest',
    }),
  )
}

export const sendPaymentResponse = (
  send: SendResponse,
  paymentDetails: PaymentRequestSummary,
) => async (
  dispatch: ThunkDispatch,
  getState: () => RootState,
  backendMiddleware: BackendMiddleware,
) => {
  const { identityWallet } = backendMiddleware
  const { requestJWT } = paymentDetails

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

  await send(response, decodedPaymentRequest.interactionToken.callbackURL)

  dispatch(cancelSSO)
}
