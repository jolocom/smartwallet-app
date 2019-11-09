import {
  JSONWebToken, JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'

export type SendResponse = (
  token: JSONWebToken<JWTEncodable>,
  route?: string
) => Promise<boolean>
