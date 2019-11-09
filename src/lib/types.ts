import { JSONWebToken, JWTEncodable } from 'jolocom-lib/js/interactionTokens/JSONWebToken'

export type SendFn = (token: JSONWebToken<JWTEncodable>) => Promise<any>
