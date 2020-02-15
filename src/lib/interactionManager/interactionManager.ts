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
    await this.validateJWT(token)

    const issuerDid = keyIdToDid(token.issuer)
    const issuer = await backendMiddleware.registry.resolve(issuerDid)
    const issuerSummary = generateIdentitySummary(issuer)

    const interaction = new Interaction(channel, token, issuerSummary)
    this.interactions[token.nonce] = interaction

    return interaction
  }

  public getInteraction(nonce: string) {
    return this.interactions[nonce]
  }

  public async addToken(token: JSONWebToken<JWTEncodable>) {
    await this.validateJWT(token)
    const interaction = this.interactions[token.nonce]
    if (!interaction) {
      throw new Error('No interaction found. Start the interaction first')
    }
    // store interaction
    interaction.flow.handleInteractionToken(token)
  }

  private async validateJWT(token: JSONWebToken<JWTEncodable>) {
    await backendMiddleware.identityWallet.validateJWT(token)
  }
}
