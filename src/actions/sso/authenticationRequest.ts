import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { assembleRequestSummary } from '.'
import { AuthenticationRequestSummary, IdentitySummary } from './types'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'

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
