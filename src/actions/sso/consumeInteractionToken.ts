import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/interactionHandlers'
import { withErrorScreen, withLoading } from '../modifiers'
import { showErrorScreen } from '../generic'
import { AppError, ErrorCode } from '@jolocom/sdk/js/src/lib/errors'
import { ThunkAction } from '../../store'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { ErrorCodes as LibErrorCode } from 'jolocom-lib/js/errors'
import { InteractionTransportType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const callHandler = (handler: () => ThunkAction) => {
  try {
    return handler()
  } catch (e) {
    if (e.message === LibErrorCode.IDWInvalidJWTSignature) {
      throw new AppError(ErrorCode.InvalidSignature, e)
    } else if (e.message === LibErrorCode.IDWNotIntendedAudience) {
      throw new AppError(ErrorCode.WrongDID, e)
    } else if (e.message === LibErrorCode.IDWIncorrectJWTNonce) {
      throw new AppError(ErrorCode.WrongNonce, e)
    } else {
      throw new AppError(ErrorCode.Unknown, e)
    }
  }
}

export const consumeInteractionToken = (
  jwt: string,
): ThunkAction => async dispatch => {
  let interactionToken: JSONWebToken<JWTEncodable>

  try {
    interactionToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new AppError(ErrorCode.ParseJWTFailed, e)
    } else if (e.message === 'Token expired') {
      throw new AppError(ErrorCode.TokenExpired, e)
    } else {
      throw new AppError(ErrorCode.Unknown, e)
    }
  }

  const handler = interactionHandlers[interactionToken.interactionType]

  return handler
    ? dispatch(
        withLoading(
          withErrorScreen(callHandler(() => handler(interactionToken, InteractionTransportType.HTTP))),
        ),
      )
    : dispatch(
        showErrorScreen(
          new AppError(ErrorCode.Unknown, new Error('No handler found for ' + interactionToken.interactionType)),
        ),
      )
}
