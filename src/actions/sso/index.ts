import { navigationActions } from 'src/actions'
import { resetSelected } from '../account'
import {
  JSONWebToken,
  JWTEncodable,
} from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { ThunkAction } from '../../store'
import { IdentitySummary } from './types'
import { AppError } from '../../lib/errors'
import { generateIdentitySummary } from './utils'
import { JolocomLib } from 'jolocom-lib'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { routeList } from '../../routeList'
import { navigate } from '../navigation'
import ErrorCode from '../../lib/errorCodes'
import { Linking } from 'react-native'
import { requestFormatter } from '../../utils/interactionRequests'
import { RequestSummary } from '../../utils/interactionRequests/types'

/**
 * The function parses the interaction token and returns the respective request summary
 * @param jwt
 */
export const consumeInteractionRequest = (jwt: string): ThunkAction => async (
  dispatch,
  getState,
  backendMiddleware,
) => {
  const { identityWallet, registry, storageLib } = backendMiddleware
  // TODO Fix
  // The identityWallet is initialised before the deep link is handled. If it
  // is not initialized, then we may not even have an identity.
  if (!identityWallet) {
    return dispatch(
      navigate({
        routeName: routeList.Landing,
      }),
    )
  }

  const requestToken = JolocomLib.parse.interactionToken.fromJWT(jwt)
  await identityWallet.validateJWT(requestToken, undefined, registry)

  const issuer = await registry.resolve(keyIdToDid(requestToken.issuer))
  const requesterSummary = generateIdentitySummary(issuer)

  await storageLib.store.issuerProfile(requesterSummary)

  const formatter = requestFormatter[requestToken.interactionType]

  if (!formatter) {
    throw new AppError(
      ErrorCode.ParseJWTFailed,
      new Error('Could not handle interaction token'),
    )
  }

  // TODO ANY
  return formatter(requestToken, requesterSummary)
}

export const assembleRequestSummary = (
  interactionToken: JSONWebToken<JWTEncodable>,
  requester: IdentitySummary,
): RequestSummary => ({
  request: interactionToken,
  requestJWT: interactionToken.encode(),
  requester,
})

export const cancelSSO = navigationActions.navigatorResetHome

export const cancelReceiving: ThunkAction = dispatch => {
  dispatch(resetSelected())
  return dispatch(navigationActions.navigatorResetHome())
}

export type InteractionTokenSender = (
  interactionResponse: JSONWebToken<JWTEncodable>,
) => Promise<void>

/**
 * @TODO CallbackURL should be present on all interaction requests at least
 * Sends an encoded interaction response via HTTP
 * @param response - Interaction response to be sent
 */

export const sendViaDeepLink = async (response: JSONWebToken<JWTEncodable>) => {
  const callbackURL = response.interactionToken.callbackURL
  const callback = `${callbackURL}/${response.encode()}`
  if (!(await Linking.canOpenURL(callback))) {
    throw new AppError(ErrorCode.DeepLinkUrlNotFound)
  }
  return Linking.openURL(callback)
}

/**
 * @TODO CallbackURL should be present on all interaction requests at least
 * Sends an encoded interaction response via a deep link
 * @param response - Interaction response to be sent
 */

export const sendViaHTTP = async (response: JSONWebToken<JWTEncodable>) => {
  const callbackURL = response.interactionToken.callbackURL
  return fetch(callbackURL, {
    method: 'POST',
    body: JSON.stringify({ token: response.encode() }),
    headers: { 'Content-Type': 'application/json' },
  })
}
