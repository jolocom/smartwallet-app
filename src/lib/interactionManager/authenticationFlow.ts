import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { InteractionType } from 'jolocom-lib/js/interactionTokens/types'
import {
  IdentitySummary,
  AuthenticationRequestSummary,
} from '../../actions/sso/types'
import { BackendMiddleware } from '../../backendMiddleware'
import { JolocomLib } from 'jolocom-lib'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { generateIdentitySummary } from 'src/actions/sso/utils'

export class AuthenticationFlow {
  public backendMiddleware: BackendMiddleware
  public tokens: Array<JSONWebToken<JWTEncodable>> = []
  public issuerSummary: IdentitySummary
  public callbackURL: string
  public authRequest: AuthenticationRequestSummary

  public constructor(
    credentialOfferRequest: JSONWebToken<Authentication>,
    backendMiddleware: BackendMiddleware,
    issuerSummary: IdentitySummary,
  ) {
    this.backendMiddleware = backendMiddleware
    this.issuerSummary = issuerSummary
    this.callbackURL = credentialOfferRequest.interactionToken.callbackURL
    this.handleInteractionToken(credentialOfferRequest)
  }

  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {
    switch (token.interactionType) {
      case InteractionType.Authentication:
        this.consumeAuthenticationRequest(token)
        break
      default:
        throw new Error('Interaction type not found')
    }
    this.tokens.push(token)
  }

  public consumeAuthenticationRequest(token: JSONWebToken<JWTEncodable>) {
    const authenticationRequest = token as JSONWebToken<Authentication>
    const { identityWallet, registry } = this.backendMiddleware
    await identityWallet.validateJWT(authenticationRequest)
    const requester = await registry.resolve(
      keyIdToDid(authenticationRequest.issuer),
    )

    const requesterSummary = generateIdentitySummary(requester)

    this.authRequest = {
      requester: requesterSummary,
      callbackURL: authenticationRequest.interactionToken.callbackURL,
      description: authenticationRequest.interactionToken.description,
      requestJWT: authenticationRequest.encode(),
    }
  }

  public sendAuthenticationResponse() {
    const { identityWallet } = this.backendMiddleware

    const { callbackURL, requestJWT, description } = this.authRequest
    const password = await this.backendMiddleware.keyChainLib.getPassword()
    const decodedAuthRequest = JolocomLib.parse.interactionToken.fromJWT<
      Authentication
    >(requestJWT)

    const response = await identityWallet.create.interactionTokens.response.auth(
      { callbackURL, description },
      password,
      decodedAuthRequest,
    )

    await fetch(callbackURL, {
      method: 'POST',
      body: JSON.stringify({ token: response.encode() }),
      headers: { 'Content-Type': 'application/json' },
    })

    return dispatch(cancelSSO)
  }
}
