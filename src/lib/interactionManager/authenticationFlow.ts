import {
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  AuthenticationRequestSummary,
} from '../../actions/sso/types'
import { Interaction } from './interaction'
import { Flow } from './flow'

export class AuthenticationFlow extends Flow {
  private authenticationRequestState!: AuthenticationRequestSummary

  public constructor(ctx: Interaction) {
    super(ctx)
  }

  public getState() {
    return this.authenticationRequestState
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
    this.authenticationRequestState = {
      requester: this.ctx.issuerSummary,
      callbackURL: token.callbackURL,
      description: token.description,
    }

    this.tokens.push(token)
  }
}
