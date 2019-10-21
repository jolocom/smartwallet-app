import { ThunkAction } from '../../store'
import { routeList } from '../../routeList'
import { JolocomLib } from 'jolocom-lib'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { interactionHandlers } from '../../lib/storage/interactionTokens'
import { AppError, ErrorCode } from '../../lib/errors'
import { generateIdentitySummary } from './utils'
import { navigate } from '../navigation'

/**
 * The function parses the interaction token and returns the respective request summary
 * @param jwt
 */
export const consumeInteractionToken = (jwt: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  // TODO Fix
  // The identityWallet is initialised before the deep link is handled. If it
  // is not initialized, then we may not even have an identity.
  if (!backendMiddleware.identityWallet) {
    return dispatch(
      navigate({
        routeName: routeList.Landing,
      }),
    )
  }

  const interactionToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  const issuer = await backendMiddleware.registry.resolve(
    keyIdToDid(interactionToken.issuer),
  )
  const handler = interactionHandlers[interactionToken.interactionType]

  if (!handler) {
    throw new AppError(
      ErrorCode.ParseJWTFailed,
      new Error('Could not handle interaction token'),
    )
  }

  return handler(interactionToken, generateIdentitySummary(issuer))
}
