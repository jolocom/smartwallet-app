import { InteractionActionType } from '../types'
import { createAccountAction } from '../utils'

export const setInteractionDetails = createAccountAction(
  InteractionActionType.setInteractionDetails,
)

export const resetInteraction = createAccountAction(
  InteractionActionType.resetInteraction,
)

export const selectShareCredential = createAccountAction(
  InteractionActionType.selectShareCredential,
)

export const updateOfferValidation = createAccountAction(
  InteractionActionType.updateOfferValidation,
)
