import { AppError, ErrorCode } from '../../lib/errors'
import { ThunkAction } from '../../store'
import { ErrorCodes as LibErrorCode } from 'jolocom-lib/js/errors'
import { interactionHandlers } from '..'

export const consumeInteractionToken = (jwt: string): ThunkAction => async (
  dispatch,
  getState,
  sdk,
) => {
  let interxn, handler

  try {
    interxn = await sdk.processJWT(jwt)
  } catch (e) {
    if (e instanceof SyntaxError) {
      throw new AppError(ErrorCode.ParseJWTFailed, e)
    } else if (e.message === 'Token expired') {
      // FIXME TODO this message is not so any more right?
      throw new AppError(ErrorCode.TokenExpired, e)
    } else {
      throw new AppError(ErrorCode.Unknown, e)
    }
  }

  handler = interactionHandlers[interxn.flow.type]
  if (!handler) {
    throw new AppError(
      ErrorCode.Unknown,
      new Error('No handler found for ' + interxn.flow.type)
    )
  }

  try {
    return dispatch(handler(interxn))
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
