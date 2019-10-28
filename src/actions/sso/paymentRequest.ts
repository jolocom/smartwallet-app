import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { assembleRequestSummary } from 'src/actions/sso'
import { IdentitySummary, PaymentRequestSummary } from './types'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'

/**
 * Given an authentication request JWT will return a {@link PaymentRequestSummary}
 * to be used by the {@link PaymentConsentContainer}.
 * @param paymentRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed payment request summary
 */

export const paymentRequestSummary = (
  paymentRequest: JSONWebToken<PaymentRequest>,
  requester: IdentitySummary,
): PaymentRequestSummary => ({
  receiver: {
    did: paymentRequest.issuer,
    address: paymentRequest.interactionToken.transactionOptions.to as string,
  },
  callbackURL: paymentRequest.interactionToken.callbackURL,
  amount: paymentRequest.interactionToken.transactionOptions.value,
  description: paymentRequest.interactionToken.description,
  ...assembleRequestSummary(paymentRequest, requester),
})

/**
 * Given an {@link PaymentRequestSummary}, uses the provided {@link IdentityWallet} to make
 * the requested transfer. It then generates and returns a signed {@link PaymentResponse} interaction token.
 * {@link PaymentRequestSummary} - a summarized payment request, as returned by {@link paymentRequestSummary}
 * @param request - decoded and validated payment request
 * @param identityWallet - Used to send the requested transaction, and to sign the returned interaction token
 * @param password - Used to sign the transfer and the payment response.
 */

export const sendFundsAndAssemblePaymentResponse = async (
  { request }: PaymentRequestSummary,
  identityWallet: IdentityWallet,
  password: string,
) => {
  const txHash = await identityWallet.transactions.sendTransaction(
    request.interactionToken as PaymentRequest,
    password,
  )

  return identityWallet.create.interactionTokens.response.payment(
    { txHash },
    password,
    request,
  )
}
