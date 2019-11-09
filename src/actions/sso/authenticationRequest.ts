import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { routeList } from 'src/routeList'
import { cancelSSO } from '.'
import { JolocomLib } from 'jolocom-lib'
import { ThunkAction } from '../../store'
import { keyIdToDid } from 'jolocom-lib/js/utils/helper'
import { generateIdentitySummary } from './utils'
import { AuthenticationRequestSummary } from './types'
import { SendFn } from '../../lib/types'

export const consumeAuthenticationRequest = (
  authenticationRequest: JSONWebToken<Authentication>,
    send: (token: JSONWebToken<Authentication>) => Promise<any>,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { identityWallet, registry } = backendMiddleware
  await identityWallet.validateJWT(authenticationRequest)
  const requester = await registry.resolve(
    keyIdToDid(authenticationRequest.issuer),
  )

  const requesterSummary = generateIdentitySummary(requester)

  const authenticationDetails: AuthenticationRequestSummary = {
    requester: requesterSummary,
    callbackURL: authenticationRequest.interactionToken.callbackURL,
    description: authenticationRequest.interactionToken.description,
    requestJWT: authenticationRequest.encode(),
  }
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.AuthenticationConsent,
      params: { send, authenticationDetails },
      key: 'authenticationRequest',
    }),
  )
}

export const sendAuthenticationResponse = (
  send: SendFn,
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

  await send(response)

  return dispatch(cancelSSO)
}
