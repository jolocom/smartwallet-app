import createAction from '~/utils/createAction'
import {
  InteractionActions,
  InteractionDetails,
  IntermediarySheetState,
} from './types'
import { FlowType } from '@jolocom/sdk'
import { OfferUICredential, AttributeTypes } from '~/types/credentials'

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

export const setIntermediaryState = createAction<IntermediarySheetState>(
  InteractionActions.setIntermediaryState,
)

export const setAttributeInputType = createAction<AttributeTypes | null>(
  InteractionActions.setAttributeInputType,
)
