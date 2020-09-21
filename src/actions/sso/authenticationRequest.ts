import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { ThunkAction } from '../../store'
import { cancelSSO, scheduleSuccessNotification } from '.'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'

export const consumeAuthenticationRequest = (
  interaction: Interaction,
): ThunkAction => async (dispatch, getState, backendMiddleware) => {
  return dispatch(
    navigationActions.navigate({
      routeName: routeList.AuthenticationConsent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary(),
      },
      key: 'authenticationRequest',
    }),
  )
}

export const sendAuthenticationResponse = (
  interactionId: string,
): ThunkAction => async (dispatch, getState, sdk) => {
  const interaction = sdk.interactionManager.getInteraction(
    interactionId,
  )
  return interaction
    .send(await interaction.createAuthenticationResponse())
    .then(() => dispatch(cancelSSO))
    .then(() => dispatch(scheduleSuccessNotification))
}
