import createAction from '~/utils/createAction'
import { InteractionsActionTypes } from './types'

export const setInteractionId = createAction(
  InteractionsActionTypes.setInteractionId,
)
export const setInteractionSheet = createAction(
  InteractionsActionTypes.setInteractionSheet,
)
export const resetInteraction = createAction(
  InteractionsActionTypes.resetInteraction,
)
