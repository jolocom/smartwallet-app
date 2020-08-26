import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { ThunkAction } from '../../store'
import { navigatorResetHome } from '../..//actions/navigation'

import { ResolutionRequest } from '@jolocom/sdk/js/src/lib/interactionManager/resolutionFlow'
import { InteractionTransportType } from '@jolocom/sdk/js/src/lib/interactionManager/types'

export const consumeResolutionRequest = (
  resolutionRequest: JSONWebToken<ResolutionRequest>,
  channel: InteractionTransportType,
): ThunkAction => async (dispatch, getState, sdk) => {
  const interxn = await sdk.interactionManager.start(channel, resolutionRequest)
  const resp = await interxn.createResolutionResponse()
  await interxn.send(resp)
  return dispatch(navigatorResetHome())
}
