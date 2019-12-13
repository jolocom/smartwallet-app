import { JolocomLib } from 'jolocom-lib'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { withErrorScreen, withLoading } from '../modifiers'
import { showErrorScreen } from '../generic'
import { AppError } from '../../lib/errors'
import ErrorCode from '../../lib/errorCodes'
import { ThunkAction } from '../../store'

export const consumeInteractionToken = (
  jwt: string,
): ThunkAction => async dispatch => {
  const interactionToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  const handler = interactionHandlers[interactionToken.interactionType]

  return handler
    ? dispatch(withLoading(withErrorScreen(handler(interactionToken))))
    : dispatch(
        showErrorScreen(
          new AppError(ErrorCode.Unknown, new Error('No handler found')),
        ),
      )
}
