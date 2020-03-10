import {
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import { Interaction } from './interaction'
import { Flow } from './flow'

export class AuthenticationFlow extends Flow {
  private authenticationDescription!: string

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.authenticationDescription
  }

  // TODO InteractionType.AuthenticaitonResponse should exist
  public handleInteractionToken(token: JWTEncodable, interactionType: InteractionType) {
    switch (interactionType) {
      case InteractionType.Authentication:
        return this.consumeAuthenticationRequest(token as Authentication)
      default:
        throw new Error('Interaction type not found')
    }
  }

  public async consumeAuthenticationRequest(token: Authentication) {
    this.authenticationDescription = token.description

    this.tokens.push(token)
  }
}
