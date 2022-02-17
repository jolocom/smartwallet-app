import createAction from '~/utils/createAction'
import { InteractionActions, InteractionDetails } from './types'
import { FlowType } from '@jolocom/sdk'
import { OfferedCredential } from '~/types/credentials'

export const setInteractionDetails = createAction<
  InteractionActions.setInteractionDetails,
  Omit<InteractionDetails, 'flowType'> & { flowType?: FlowType | null }
>(InteractionActions.setInteractionDetails)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const selectShareCredential = createAction<
  InteractionActions.selectShareCredential,
  Record<string, string>
>(InteractionActions.selectShareCredential)

export const updateOfferValidation = createAction<
  InteractionActions.updateOfferValidation,
  OfferedCredential[]
>(InteractionActions.updateOfferValidation)

export const setRedirectUrl = createAction<
  InteractionActions.setRedirectUrl,
  string | null
>(InteractionActions.setRedirectUrl)
