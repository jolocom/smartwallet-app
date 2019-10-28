import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { CredentialOfferSummary, IdentitySummary } from './types'
import { assembleRequestSummary } from './index'

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
