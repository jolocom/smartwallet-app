import { InteractionActionType } from '../types'
import { createInteractionAction } from '../utils'

export const setInteractionDetails = createInteractionAction(
  InteractionActionType.setInteractionDetails,
)

export const resetInteraction = createInteractionAction(
  InteractionActionType.resetInteraction,
)

export const selectShareCredential = createInteractionAction(
  InteractionActionType.selectShareCredential,
)

export const updateOfferValidation = createInteractionAction(
  InteractionActionType.updateOfferValidation,
)
