import { Interaction } from './interaction'
import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'

export interface FlowState {}

export abstract class Flow {
  protected ctx: Interaction
  public abstract state: FlowState

  constructor(ctx: Interaction) {
    this.ctx = ctx
  }

  abstract async handleInteractionToken(
    token: JWTEncodable,
    messageType: InteractionType,
  ): Promise<boolean>

  public getState() {
    return this.state
  }
}
