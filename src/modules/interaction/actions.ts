import createAction from '~/utils/createAction'
import { InteractionActions } from './types'

export const setInteractionDetails = createAction(
  InteractionActions.setInteractionDetails,
)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const setInteractionAttributes = createAction(
  InteractionActions.setInteractionAttributes,
)

export const setAttributesToShare = createAction(
  InteractionActions.setAttributesToShare,
)

export const selectAttr = createAction(InteractionActions.selectAttr)
export const setIntermediaryState = createAction(
  InteractionActions.setIntermediaryState,
)

export const setAttributeInputKey = createAction(
  InteractionActions.setAttributeInputKey,
)
