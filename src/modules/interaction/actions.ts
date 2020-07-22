import createAction from '~/utils/createAction'
import { InteractionActions } from './types'

export const setInteraction = createAction(InteractionActions.setInteraction)
export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)
export const setInteractionSummary = createAction(
  InteractionActions.setInteractionSummary,
)

export const setInteractionAttributes = createAction(
  InteractionActions.setInteractionAttributes,
)

export const setInitialSelectedAttributes = createAction(
  InteractionActions.setInitialSelectedAttributes,
)

export const selectAttr = createAction(InteractionActions.selectAttr)
