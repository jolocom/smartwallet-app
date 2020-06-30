import createAction from '~/utils/createAction'
import { InteractionActions } from './types'

export const setInteraction = createAction(InteractionActions.setInteraction)
export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)
export const setInteractionSummary = createAction(
  InteractionActions.setInteractionSummary,
)
