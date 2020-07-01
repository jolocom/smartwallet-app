import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { Authentication } from 'jolocom-lib/js/interactionTokens/authentication'
import { routeList } from 'src/routeList'
import { ThunkAction } from '../../store'
import { InteractionChannel } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { cancelSSO } from '.'

export const consumeAuthenticationRequest = (
  authenticationRequest: JSONWebToken<Authentication>,
  channel: InteractionChannel
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const { interactionManager } = backendMiddleware
  const interaction = await interactionManager.start(
    channel,
    authenticationRequest
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.AuthenticationConsent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary()
      },
      key: 'authenticationRequest',
    }),
  )
}

export const sendAuthenticationResponse = (
  interactionId: string
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  const interaction = backendMiddleware.interactionManager.getInteraction(interactionId)
  return interaction.send(await interaction.createAuthenticationResponse()).then(() => dispatch(cancelSSO))
}
