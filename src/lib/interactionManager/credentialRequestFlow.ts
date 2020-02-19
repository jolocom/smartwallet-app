import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

export class CredentialRequestFlow {
  public handleInteractionToken(token: JSONWebToken<JWTEncodable>) {}
}
