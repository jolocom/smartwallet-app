import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { ThunkAction } from '../../store'
import {
  InteractionTransportType,
  EstablishChannelRequest,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { navigatorResetHome } from 'src/actions/navigation'

export const consumeEstablishChannelRequest = (
  establishChannelRequest: JSONWebToken<EstablishChannelRequest>,
  channel: InteractionTransportType,
): ThunkAction => async (dispatch, getState, sdk) => {
  const { interactionManager } = sdk
  const interaction = await interactionManager.start<EstablishChannelRequest>(
    InteractionTransportType.HTTP,
    establishChannelRequest,
  )

  return dispatch(
    navigationActions.navigate({
      routeName: routeList.EstablishChannelConsent,
      params: {
        interactionId: interaction.id,
        interactionSummary: interaction.getSummary(),
      },
      key: 'establishChannelConsent',
    }),
  )
}

export const startChannel = (interactionId: string): ThunkAction => async (
  dispatch,
  getState,
  sdk,
) => {
  const interaction = sdk.interactionManager.getInteraction(interactionId)

  const response = await interaction.createEstablishChannelResponse(0)
  await interaction.processInteractionToken(response)
  const channel = await sdk.channels.create(interaction)
  channel.start()

  return dispatch(navigatorResetHome())
}
