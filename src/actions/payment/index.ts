import { Dispatch, AnyAction } from 'redux'
import { JolocomLib } from 'jolocom-lib'
import { BackendMiddleware } from 'src/backendMiddleware'
import { navigationActions, accountActions } from 'src/actions'
import { showErrorScreen } from 'src/actions/generic'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { PaymentRequest} from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { jolocomEthTransactionConnector } from 'jolocom-lib/js/ethereum/transactionConnector'
import { SoftwareKeyProvider } from 'jolocom-lib/js/vaultedKeyProvider/softwareProvider'
import { publicKeyToAddress } from  'jolocom-lib/js/utils/helper'
import { PaymentStateSummary } from 'src/reducers/payment'
import { routeList } from 'src/routeList'

export const setPaymentRequest = (request: PaymentStateSummary) => {
  return {
    type: 'SET_PAYMENT_REQUEST',
    value: request
  }
}

export const clearPaymentRequest = () => {
  return {
    type: 'CLEAR_PAYMENT_REQUEST'
  }
}

export const consumePaymentRequest = (paymentRequest: JSONWebToken<PaymentRequest>) => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { identityWallet } = backendMiddleware

    try {
      await identityWallet.validateJWT(paymentRequest)

      // TODO: add the UI specific info here
      const summary = {
        requestJWT: paymentRequest.encode()
      }

      dispatch(setPaymentRequest(summary))
      dispatch(accountActions.toggleLoading(false))
      // TODO: insert redirection to relevant screen
    } catch (err) {
      dispatch(accountActions.toggleLoading(false))
      dispatch(showErrorScreen(new Error('Consuming payment request failed.')))
    }
  }
}

export const sendPaymentResponse = () => {
  return async (dispatch: Dispatch<AnyAction>, getState: Function, backendMiddleware: BackendMiddleware) => {
    const { keyChainLib, identityWallet, storageLib } = backendMiddleware
    const { activePaymentRequest } = getState().payment
    const paymentRequest = JolocomLib.parse.interactionToken.fromJWT(activePaymentRequest.requestJWT)

    try {
      const password = await keyChainLib.getPassword()

      const ethAddress = publicKeyToAddress(identityWallet.getPublicKey({
        encryptionPass: password,
        derivationPath: JolocomLib.KeyTypes.ethereumKey
      }))
      const tx = await jolocomEthTransactionConnector.createTransaction({
        ...paymentRequest.interactionToken.transactionDetails,
        senderAddress: ethAddress
      })

      const encodedEntropy = await storageLib.get.encryptedSeed()
      const userVault = new SoftwareKeyProvider(Buffer.from(encodedEntropy, 'hex'), password)

      tx.sign(userVault.getPrivateKey({
        encryptionPass: password,
        derivationPath: JolocomLib.KeyTypes.ethereumKey
      }))
      tx.serialize()

      const txReceipt = await jolocomEthTransactionConnector.sendSignedTransaction(tx)

      const paymentResponseJWT = await identityWallet.create.interactionTokens.response.payment(
        { txHash: txReceipt.transactionHash },
        password,
        paymentRequest
      )

      await fetch(paymentRequest.interactionToken.callbackURL, {
        method: 'POST',
        body: JSON.stringify({ token: paymentResponseJWT.encode() }),
        headers: { 'Content-Type': 'application/json' }
      })
      
      dispatch(clearPaymentRequest())
      dispatch(accountActions.toggleLoading(false))
      dispatch(navigationActions.navigate({ routeName: routeList.Home }))
    } catch (err) {
      dispatch(accountActions.toggleLoading(false))
      dispatch(showErrorScreen(new Error('Creating and sending payment response failed.')))
    }
  }
}
