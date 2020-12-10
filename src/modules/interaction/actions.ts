import createAction from '~/utils/createAction'
import { InteractionActions } from './types'

export const setInteractionDetails = createAction(
  InteractionActions.setInteractionDetails,
)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const selectShareCredential = createAction(
  InteractionActions.selectShareCredential,
)

export const setIntermediaryState = createAction(
  InteractionActions.setIntermediaryState,
)

export const setAttributeInputType = createAction(
  InteractionActions.setAttributeInputType,
)
