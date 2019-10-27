import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { credentialOfferSummary } from '../../actions/sso/credentialOfferRequest'
import { paymentRequestSummary } from '../../actions/sso/paymentRequest'
import { credReceiveSummary } from '../../actions/sso/credentialOfferResponse'
import { authRequestSummary } from '../../actions/sso/authenticationRequest'
import { credentialRequestSummary } from '../../actions/sso/credentialRequest'

/**
 * @DEV Formats the request, and returns it.
 * This is passed as a prop to the consent container, where it can be used to prepare the response
 */

export const requestFormatter = {
  [InteractionType.Authentication]: authRequestSummary,
  [InteractionType.CredentialRequest]: credentialRequestSummary,
  [InteractionType.CredentialOfferRequest]: credentialOfferSummary,
  [InteractionType.PaymentRequest]: paymentRequestSummary,
  [InteractionType.CredentialsReceive]: credReceiveSummary,
}
