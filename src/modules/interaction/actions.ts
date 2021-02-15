import createAction from '~/utils/createAction'
import { InteractionActions, InteractionDetails } from './types'
import { FlowType } from '@jolocom/sdk'
import { OfferUICredential } from '~/types/credentials'

export const setInteractionDetails = createAction<
  Omit<InteractionDetails, 'flowType'> & { flowType?: FlowType | null }
>(InteractionActions.setInteractionDetails)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const selectShareCredential = createAction<Record<string, string>>(
  InteractionActions.selectShareCredential,
)

export const updateOfferValidation = createAction<OfferUICredential[]>(
  InteractionActions.updateOfferValidation,
)
