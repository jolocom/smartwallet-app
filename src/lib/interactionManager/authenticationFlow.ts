import { JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { Interaction } from './interaction'
import { Flow } from './flow'
import { AuthenticationFlowState } from './types'

export class AuthenticationFlow extends Flow {
  private description!: AuthenticationFlowState

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.description
  }

  // TODO InteractionType.AuthenticaitonResponse should exist
  public handleInteractionToken(
    token: JWTEncodable,
    interactionType: InteractionType,
  ) {
    switch (interactionType) {
      case InteractionType.Authentication:
        return this.consumeAuthenticationRequest(token as Authentication)
      default:
        throw new Error('Interaction type not found')
    }
  }

  public async consumeAuthenticationRequest(token: Authentication) {
    this.description = token.description
  }
}
