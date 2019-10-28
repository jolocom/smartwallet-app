import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { IdentityWallet } from 'jolocom-lib/js/identityWallet/identityWallet'
import { PaymentRequestSummary } from '../../utils/interactionRequests/types'

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
