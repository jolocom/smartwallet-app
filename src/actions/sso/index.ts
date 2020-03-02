import { Linking } from 'react-native'
import { JolocomLib } from 'jolocom-lib'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { CredentialRequest } from 'jolocom-lib/js/interactionTokens/credentialRequest'
import { ThunkAction } from '../../store'
import {
  CredentialRequestSummary,
  CredentialVerificationSummary,
} from './types'
import { AppError, ErrorCode } from 'src/lib/errors'
import { InteractionChannel } from 'src/lib/interactionManager/types';

export const consumeCredentialRequest = (
  credentialRequest: JSONWebToken<CredentialRequest>,
  interactionChannel: InteractionChannel // TODO replace with send function at one point
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { interactionManager } = backendMiddleware

  const interaction = await interactionManager.start(
    interactionChannel,
    credentialRequest
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.Consent,
      params: { interactionId: interaction.id, credentialRequestDetails: interaction.getState() },
      key: 'credentialRequest',
    }),
  )
}

export const sendCredentialResponse = (
  selectedCredentials: CredentialVerificationSummary[],
  credentialRequestDetails: CredentialRequestSummary,
  interactionId: string
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { storageLib, interactionManager, keyChainLib, identityWallet } = backendMiddleware
  const { callbackURL, requestJWT } = credentialRequestDetails

  const password = await keyChainLib.getPassword()
  const request = JolocomLib.parse.interactionToken.fromJWT(requestJWT)

  const credentials = await Promise.all(
    selectedCredentials.map(
      async cred =>
        (await storageLib.get.verifiableCredential({ id: cred.id }))[0],
    ),
  )

  const jsonCredentials = credentials.map(cred => cred.toJSON())

  const response = await identityWallet.create.interactionTokens.response.share(
    {
      callbackURL,
      suppliedCredentials: jsonCredentials,
    },
    password,
    request,
  )

  if (interactionManager.getInteraction(interactionId).channel === InteractionChannel.Deeplink) {
    const callback = `${callbackURL}${response.encode()}`
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
  dispatch(cancelSSO)
}

export const cancelSSO: ThunkAction = dispatch => {
  return dispatch(navigationActions.navigatorResetHome())
}
