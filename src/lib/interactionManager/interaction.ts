import { CredentialOfferFlow } from './credentialOfferFlow'
import { IdentitySummary } from '../../actions/sso/types'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { BackendMiddleware } from '../../backendMiddleware'
import { InteractionChannel, InteractionFlows } from './types'
import { CredentialRequestFlow } from './credentialRequestFlow'

/***
 * - initiated by InteractionManager when an interaction starts
 * - handles the communication channel of the interaction
 * - holds the instance of the particular interaction (e.g. CredentialOffer, Authentication)
 */
export class Interaction {
  public id: string
  private interactionFlow = {
    [InteractionType.CredentialOfferRequest]: CredentialOfferFlow,
    [InteractionType.CredentialRequest]: CredentialRequestFlow,
  }
  public flow: InteractionFlows
  public channel: InteractionChannel
  public issuerSummary: IdentitySummary

  public constructor(
    backendMiddleware: BackendMiddleware,
    channel: InteractionChannel,
    jwt: JSONWebToken<JWTEncodable>,
    issuerSummary: IdentitySummary,
  ) {
    this.flow = new this.interactionFlow[jwt.interactionType](
      jwt,
      backendMiddleware,
      issuerSummary,
    )
    this.channel = channel
    this.issuerSummary = issuerSummary
    this.id = jwt.nonce
  }

  public getFlow<T extends InteractionFlows>(): T {
    // TODO fix type casting
    return this.flow as T
  }
}
