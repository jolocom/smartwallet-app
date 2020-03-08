import { Interaction } from './interaction'
import {
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

export abstract class Flow {
  protected ctx: Interaction
  protected tokens: Array<JWTEncodable> = []

  constructor(ctx: Interaction) {
    this.ctx = ctx
  }

  // Can this abstract anything?
  abstract async handleInteractionToken(
    token: JWTEncodable,
    messageType: InteractionType
  ): Promise<any>

  // @TODO Make sure this is only used for rendering
  abstract getState(): any

  public getMessages() {
    return this.tokens
  }
}
