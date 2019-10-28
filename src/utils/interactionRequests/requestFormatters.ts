import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { PaymentRequest } from 'jolocom-lib/js/interactionTokens/paymentRequest'
import { assembleRequestSummary } from '../../actions/sso'
import {
  AuthenticationRequestSummary,
  CredentialOfferSummary,
  CredentialReceiveSummary,
  CredentialRequestSummary,
  PaymentRequestSummary,
} from './types'
import { IdentitySummary } from '../../actions/sso/types'

/**
 * Given an authentication request JWT will return a {@link AuthenticationRequestSummary}
 * to be used by the {@link AuthenticationConsentContainer}.
 * @param authRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed authentication request summary
 */

export const authRequestSummary = (
  authRequest: JSONWebToken<Authentication>,
  requester: IdentitySummary,
): AuthenticationRequestSummary => ({
  description: authRequest.interactionToken.description,
  callbackURL: authRequest.interactionToken.callbackURL,
  ...assembleRequestSummary(authRequest, requester),
})

/**
 * Given an credential offer JWT will return a {@link CredentialOfferSummary}
 * to be used by the {@link CredentialReceiveContainer}.
 * @param credOfferRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed credential offer summary
 */

export const credentialOfferSummary = (
  credOfferRequest: JSONWebToken<CredentialOfferRequest>,
  requester: IdentitySummary,
): CredentialOfferSummary => ({
  ...assembleRequestSummary(credOfferRequest, requester),
  callbackURL: credOfferRequest.interactionToken.callbackURL,
})

/**
 * Given an credential receive JWT will return a {@link CredentialReceiveSummary}
 * to be used by the {@link CredentialReceive} container.
 * @param interactionRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed credential receive summary
 */

export const credReceiveSummary = (
  interactionRequest: JSONWebToken<JWTEncodable>,
  requester: IdentitySummary,
): CredentialReceiveSummary => ({
  ...assembleRequestSummary(interactionRequest, requester),
  callbackURL: interactionRequest.interactionToken.callbackURL,
})

/**
 * Given an credential request JWT will return a {@link CredentialRequestSummary}
 * to be used by the {@link ShareConsentContainer}.
 * @param credentialRequest - the interaction token received from the counterparty
 * @param requester - a summary of the requester's identity
 * @returns a parsed credential request summary
 */

export const credentialRequestSummary = (
  credentialRequest: JSONWebToken<CredentialRequest>,
  requester: IdentitySummary,
): CredentialRequestSummary => ({
  callbackURL: credentialRequest.interactionToken.callbackURL,
  ...assembleRequestSummary(credentialRequest, requester),
})

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
