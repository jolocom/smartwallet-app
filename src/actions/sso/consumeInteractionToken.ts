import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { withErrorScreen, withLoading } from '../modifiers'
import { showErrorScreen } from '../generic'
import { AppError } from '../../lib/errors'
import ErrorCode from '../../lib/errorCodes'
import { ThunkAction } from '../../store'

const callHandler = handler => {
  try {
    return handler()
  } catch (e) {
    if (e.message === 'Signature on token is invalid') {
      throw new AppError(ErrorCode.InvalidSignature, e)
    } else if (
      e.message === 'You are not the intended audience of received token'
    ) {
      throw new AppError(ErrorCode.WrongDID, e)
    } else if (e.message === 'The token nonce does not match the request') {
      throw new AppError(ErrorCode.WrongNonce, e)
    } else {
      throw new AppError(ErrorCode.Unknown, e)
    }
  }
}

export const consumeInteractionToken = (
  jwt: string,
): ThunkAction => async dispatch => {
  let interactionToken
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
          withErrorScreen(callHandler(() => handler(interactionToken))),
        ),
      )
    : dispatch(
        showErrorScreen(
          new AppError(ErrorCode.Unknown, new Error('No handler found')),
        ),
      )
}
