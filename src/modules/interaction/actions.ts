import createAction from '~/utils/createAction'
import { InteractionActions } from './types'

export const setInteractionIdAndType = createAction(
  InteractionActions.setInteractionIdAndType,
)

export const setInteractionDetails = createAction(
  InteractionActions.setInteractionDetails,
)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const setInteractionAttributes = createAction(
  InteractionActions.setInteractionAttributes,
)

export const setInitialSelectedAttributes = createAction(
  InteractionActions.setInitialSelectedAttributes,
)

export const selectAttr = createAction(InteractionActions.selectAttr)
export const setIntermediaryState = createAction(
  InteractionActions.setIntermediaryState,
)

export const setAttributeInputKey = createAction(
  InteractionActions.setAttributeInputKey,
)
