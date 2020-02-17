import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { backendMiddleware } from '../../store'
import { generateIdentitySummary } from '../../actions/sso/utils'
import { InteractionChannel } from './credentialOfferFlow'
import { Interaction } from './interaction'

interface InteractionState {
  [nonce: string]: Interaction
}

/***
 * - initiated inside BackendMiddleware
 * - has access to identityWallet / registry ?? (or should be inside Interaction)
 * - holds a map of all interactions:
 *    - {nonce: token or interaction instance} ??
 * - can start / end an interaction
 *
 */

export class InteractionManager {
  public readonly interactions: InteractionState = {}

  public async start(
    channel: InteractionChannel,
    token: JSONWebToken<JWTEncodable>,
  ) {
    //NOTE this is here because the Interaction constructor cannot be async
    await backendMiddleware.identityWallet.validateJWT(token)
    const issuerSummary = await this.getIssuerSummary(token.issuer)
    const interaction = new Interaction(channel, token, issuerSummary)
    this.interactions[token.nonce] = interaction

    return interaction
  }

  public async getIssuerSummary(issuer: string) {
    const issuerDid = keyIdToDid(issuer)
    const issuerIdentity = await backendMiddleware.registry.resolve(issuerDid)
    return generateIdentitySummary(issuerIdentity)
  }

  public getInteraction(id: string) {
    return this.interactions[id]
  }
}
