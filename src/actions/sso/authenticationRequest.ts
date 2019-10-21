import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { cancelSSO } from '.'
import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import { ThunkAction } from '../../store'
import { AppError } from '../../lib/errors'
import ErrorCode from '../../lib/errorCodes'
import { AuthenticationRequestSummary, IdentitySummary } from './types'

export const consumeAuthenticationRequest = (
  authenticationRequest: JSONWebToken<Authentication>,
  requester: IdentitySummary,
): AuthenticationRequestSummary => ({
  requester,
  callbackURL: authenticationRequest.interactionToken.callbackURL,
  description: authenticationRequest.interactionToken.description,
  requestJWT: authenticationRequest.encode(),
})

export const sendAuthenticationResponse = (
  isDeepLinkInteraction: boolean,
  authenticationDetails: AuthenticationRequestSummary,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { identityWallet } = backendMiddleware

  const { callbackURL, requestJWT, description } = authenticationDetails
  const password = await backendMiddleware.keyChainLib.getPassword()
  const decodedAuthRequest = JolocomLib.parse.interactionToken.fromJWT<
    Authentication
  >(requestJWT)

  const response = await identityWallet.create.interactionTokens.response.auth(
    { callbackURL, description },
    password,
    decodedAuthRequest,
  )

  if (isDeepLinkInteraction) {
    const callback = `${callbackURL}/${response.encode()}`
    if (!(await Linking.canOpenURL(callback))) {
      throw new AppError(ErrorCode.DeepLinkUrlNotFound)
    }
    return Linking.openURL(callback).then(() => dispatch(cancelSSO))
  }

  await fetch(callbackURL, {
    method: 'POST',
    body: JSON.stringify({ token: response.encode() }),
    headers: { 'Content-Type': 'application/json' },
  })

  return dispatch(cancelSSO)
}
