import { navigationActions } from 'src/actions'
import { routeList } from 'src/routeList'
import { ThunkAction } from '../../store'
import { Interaction, FlowType } from '@jolocom/sdk'
import { cancelSSO, scheduleSuccessNotification } from '.'
import { scheduleNotification } from '../notifications'
import { createInfoNotification } from '../../lib/notifications'
import I18n from 'src/locales/i18n'
import strings from '../../locales/strings'

export const consumeEstablishChannelRequest = (
  interaction: Interaction,
): ThunkAction => async (dispatch, getState, sdk) => {
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

  const successNotification = (message: string) => {
    dispatch(
      scheduleNotification(
        createInfoNotification({
          title: I18n.t(strings.ACTION_SUCCEEDED),
          message: I18n.t(message),
        }),
      ),
    )
  }

  channel.send(response)
  channel.start(async interxn => {
    let resp
    switch (interxn.flow.type) {
      case FlowType.Resolution:
        resp = await interxn.createResolutionResponse()
        break
      case FlowType.Encrypt:
        resp = await interxn.createEncResponseToken()
        successNotification(strings.YOUR_DATA_WAS_ENCRYPTED)
        break
      case FlowType.Decrypt:
        resp = await interxn.createDecResponseToken()
        successNotification(strings.YOUR_DATA_WAS_DECRYPTED)
        break
    }

    if (resp) {
      channel.send(resp)
    } else {
      console.warn(
        'received illegal interxn request on channel',
        channel.id,
        interxn.flow.type,
      )
      dispatch(
        scheduleNotification(
          createInfoNotification({
            title: I18n.t(strings.AWKWARD),
            message: I18n.t(strings.SOMETHING_DOESNT_SEEM_RIGHT),
          }),
        ),
      )
    }
  })

  dispatch(cancelSSO)
  dispatch(scheduleSuccessNotification)
}
