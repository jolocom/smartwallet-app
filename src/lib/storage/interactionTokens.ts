import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { AssembledCredential, formatCredentialRequest } from '../../actions/sso'
import { formatAuthenticationRequest } from '../../actions/sso/authenticationRequest'
import { formatCredentialOfferRequest } from '../../actions/sso/credentialOfferRequest'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { formatPaymentRequest } from '../../actions/sso/paymentRequest'
import {
  ExternalCredentialSummary,
  IdentitySummary,
} from '../../actions/sso/types'
/**
 * @param Metadata should not need to be passed to credential receive because it comes from cred Offer
 * Furthermore, this only needs to be defined for requests
 */

export const interactionHandlers = {
  [InteractionType.Authentication]: <T extends JSONWebToken<Authentication>>(
    interactionToken: T,
    requesterSummary: IdentitySummary,
  ) => formatAuthenticationRequest(interactionToken, requesterSummary),
  [InteractionType.CredentialRequest]: <
    T extends JSONWebToken<CredentialRequest>
  >(
    interactionToken: T,
    requesterSummary: IdentitySummary,
    assembledCredentials: AssembledCredential[],
  ) =>
    formatCredentialRequest(
      interactionToken,
      requesterSummary,
      assembledCredentials,
    ),
  [InteractionType.CredentialOfferRequest]: <
    T extends JSONWebToken<CredentialOfferRequest>
  >(
    interactionToken: T,
    requesterSummary: IdentitySummary,
    receivedCredentials: ExternalCredentialSummary[],
  ) =>
    formatCredentialOfferRequest(
      interactionToken,
      requesterSummary,
      receivedCredentials,
    ),
  [InteractionType.PaymentRequest]: <T extends JSONWebToken<PaymentRequest>>(
    interactionToken: T,
    requesterSummary: IdentitySummary,
  ) => formatPaymentRequest(interactionToken, requesterSummary),
}
