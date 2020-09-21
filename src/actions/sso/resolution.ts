import { ThunkAction } from '../../store'

import { scheduleSuccessNotification, cancelSSO } from '.'
import { Interaction } from '@jolocom/sdk/js/src/lib/interactionManager/interaction'

export const consumeResolutionRequest = (
  interxn: Interaction,
): ThunkAction => async (dispatch, getState, sdk) => {
  const resp = await interxn.createResolutionResponse()

  return interxn
    .send(resp)
    .then(() => dispatch(cancelSSO))
    .then(() => dispatch(scheduleSuccessNotification))
}
