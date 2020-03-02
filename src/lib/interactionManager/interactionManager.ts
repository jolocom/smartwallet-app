import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { generateIdentitySummary } from '../../actions/sso/utils'
import { Interaction } from './interaction'
import { BackendMiddleware } from '../../backendMiddleware'
import { InteractionChannel, InteractionState } from './types'

/***
 * - initiated inside BackendMiddleware
 * - has access to identityWallet / registry ?? (or should be inside Interaction)
 * - holds a map of all interactions:
 *    - {nonce: token or interaction instance} ??
 * - can start / end an interaction
 *
 */

export class InteractionManager {
  public interactions: InteractionState = {}
  public readonly backendMiddleware: BackendMiddleware

  public constructor(backendMiddleware: BackendMiddleware) {
    this.backendMiddleware = backendMiddleware
  }

  public async start(
    channel: InteractionChannel,
    token: JSONWebToken<JWTEncodable>,
  ) {
    // TODO Eventually backendMiddleware shouldn't go in anymore
    const interaction = new Interaction(
      this.backendMiddleware,
      channel,
      token.nonce,
    )

    this.interactions[token.nonce] = interaction
    await interaction.handleInteractionToken(token)

    return interaction
  }

  public async getIssuerSummary(issuer: string) {
    const issuerDid = keyIdToDid(issuer)
    const issuerIdentity = await this.backendMiddleware.registry.resolve(
      issuerDid,
    )
    return generateIdentitySummary(issuerIdentity)
  }

  public getInteraction(id: string) {
    return this.interactions[id]
  }
}
