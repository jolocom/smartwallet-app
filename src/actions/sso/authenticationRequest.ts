import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { StateAuthenticationRequestSummary } from 'src/reducers/sso'
import { routeList } from 'src/routeList'
import { cancelSSO, clearInteractionRequest } from '.'
import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import { ThunkAction } from '../../store'
import { AppError } from '../../lib/errors'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import ErrorCode from '../../lib/errorCodes'
import { parsePublicProfile } from './utils'

export const setAuthenticationRequest = (
  request: StateAuthenticationRequestSummary,
) => ({
  type: 'SET_AUTHENTICATION_REQUEST',
  value: request,
})

export const consumeAuthenticationRequest = (
  authenticationRequest: JSONWebToken<Authentication>,
  isDeepLinkInteraction: boolean = false,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { identityWallet, registry } = backendMiddleware
  await identityWallet.validateJWT(authenticationRequest)
  const requester = await registry.resolve(
    keyIdToDid(authenticationRequest.issuer),
  )

  const requesterSummary = parsePublicProfile(requester)

  const authenticationDetails: StateAuthenticationRequestSummary = {
    requester: requesterSummary,
    callbackURL: authenticationRequest.interactionToken.callbackURL,
    description: authenticationRequest.interactionToken.description,
    requestJWT: authenticationRequest.encode(),
  }
  dispatch(setAuthenticationRequest(authenticationDetails))
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.AuthenticationConsent,
      params: { isDeepLinkInteraction },
      key: 'authenticationRequest',
    }),
  )
}

export const sendAuthenticationResponse = (
  isDeepLinkInteraction: boolean,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { identityWallet } = backendMiddleware

  const {
    callbackURL,
    requestJWT,
    description,
  } = getState().sso.activeAuthenticationRequest
  try {
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
  } finally {
    dispatch(clearInteractionRequest)
  }
}
