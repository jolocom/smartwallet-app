import createAction from '~/utils/createAction'
import { InteractionActions, InteractionDetails } from './types'
import { FlowType } from '@jolocom/sdk'
import { OfferedCredential } from '~/types/credentials'
import { IAusweisRequest } from '~/screens/LoggedIn/eID/types'

export const setInteractionDetails = createAction<
  Omit<InteractionDetails, 'flowType'> & { flowType?: FlowType | null }
>(InteractionActions.setInteractionDetails)

export const resetInteraction = createAction(
  InteractionActions.resetInteraction,
)

export const selectShareCredential = createAction<Record<string, string>>(
  InteractionActions.selectShareCredential,
)

export const updateOfferValidation = createAction<OfferedCredential[]>(
  InteractionActions.updateOfferValidation,
)

export const setAusweisInteractionDetails =
  createAction<IAusweisRequest | null>(
    InteractionActions.setAusweisInteractionDetails,
  )
