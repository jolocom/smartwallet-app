import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  authRequestSummary,
  credentialOfferSummary,
  credentialRequestSummary,
  credReceiveSummary,
  paymentRequestSummary,
} from './requestFormatters'

/**
 * Mapping interaction types -> handler functions, which given a {@link JSONWebToken} and the
 * requester's summary ({@link IdentitySummary}), will return a request summary (i.e. data structure
 * extending the {@link RequestSummary}) interface.
 * The return value of the formatter will be passed to the corresponding interaction consent container.
 */

export const requestFormatter = {
  [InteractionType.Authentication]: authRequestSummary,
  [InteractionType.CredentialRequest]: credentialRequestSummary,
  [InteractionType.CredentialOfferRequest]: credentialOfferSummary,
  [InteractionType.PaymentRequest]: paymentRequestSummary,
  [InteractionType.CredentialsReceive]: credReceiveSummary,
}
