import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { consumeCredentialRequest } from '../../actions/sso'
import { consumeAuthenticationRequest } from '../../actions/sso/authenticationRequest'
import { consumeCredentialOfferRequest } from '../../actions/sso/credentialOfferRequest'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { consumePaymentRequest } from '../../actions/sso/paymentRequest'
import { SendResponse } from 'src/lib/transportLayers'
/**
 * @param Metadata should not need to be passed to credential receive because it comes from cred Offer
 * Furthermore, this only needs to be defined for requests
 */

export const interactionHandlers = {
  [InteractionType.Authentication]: <T extends JSONWebToken<Authentication>>(
    interactionToken: T,
    send: SendResponse,
  ) => consumeAuthenticationRequest(interactionToken, send),
  [InteractionType.CredentialRequest]: <T extends JSONWebToken<CredentialRequest>>(
    interactionToken: T,
    send: SendResponse,
  ) => consumeCredentialRequest(interactionToken, send),
  [InteractionType.CredentialOfferRequest]: <
    T extends JSONWebToken<CredentialOfferRequest>
  >(
    interactionToken: T,
    isDeepLinkInteraction: boolean,
  ) => consumeCredentialOfferRequest(interactionToken, isDeepLinkInteraction),
  [InteractionType.PaymentRequest]: <T extends JSONWebToken<PaymentRequest>>(
    interactionToken: T,
    isDeepLinkInteraction: boolean,
  ) => consumePaymentRequest(interactionToken, isDeepLinkInteraction),
}
