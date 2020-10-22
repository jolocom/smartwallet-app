import { SDKError } from '@jolocom/sdk'
import { JolocomLib } from 'jolocom-lib'

export const parseJWT = (jwt: string) => {
  try {
    return JolocomLib.parse.interactionToken.fromJWT(jwt)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new Error(SDKError.codes.ParseJWTFailed)
    } else if (e.message === 'Token expired') {
      throw new Error(SDKError.codes.TokenExpired)
    } else {
      throw new Error(SDKError.codes.Unknown)
    }
  }
}
