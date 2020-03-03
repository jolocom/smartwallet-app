import {
  JSONWebToken,
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

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    switch (token.interactionType) {
      case InteractionType.Authentication:
        return this.consumeAuthenticationRequest(token as JSONWebToken<Authentication>)
      default:
        throw new Error('Interaction type not found')
    }
  }

  public async consumeAuthenticationRequest(token: JSONWebToken<Authentication>) {
    if (token.signer.did === this.ctx.ctx.identityWallet.did) {
      return this.ctx.send(token)
    }

    this.authenticationRequestState = {
      requester: this.ctx.issuerSummary,
      callbackURL: token.interactionToken.callbackURL,
      description: token.interactionToken.description,
      requestJWT: token.encode(),
    }

    // This is to surpress every path returning a value
    return
  }
}
