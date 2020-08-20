import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { ThunkAction } from '../../store'
import {
  InteractionTransportType,
  EstablishChannelRequest,
  FlowType,
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
  channel.send(response.encode())
  channel.start(async (interxn) => {
    console.log('handing interxn', interxn.id, interxn.flow.type)
    let resp
    // TODO: make this configurable
    //       for now hardcoded
    switch (interxn.flow.type) {
//      case FlowType.Authentication:
//        resp = await interxn.createAuthenticationResponse()
//        break
      case FlowType.Encrypt:
        resp = await interxn.createEncResponseToken()
        break
      case FlowType.Decrypt:
        resp = await interxn.createDecResponseToken()
        break
    }

    if (resp) {
      channel.send(resp.encode())
    }
  })

  return dispatch(navigatorResetHome())
}
