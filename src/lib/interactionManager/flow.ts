import { Interaction } from './interaction'
import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

export abstract class Flow {
  protected ctx: Interaction

  constructor(ctx: Interaction) {
    this.ctx = ctx
  }

  abstract async handleInteractionToken(
    token: JWTEncodable,
    messageType: InteractionType,
  ): Promise<void>

  abstract getState(): any
}
