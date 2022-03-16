import createAction from '~/utils/createAction'
import {
  InteractionAction,
  InteractionActions,
  InteractionActionType,
} from './types'

// To avoid manually passing a generic type every time we call `createAccountAction`
// redeclaring createAccountAction fn with types specific to the `interaction` module
function createAccountAction<K extends keyof InteractionActions>(type: K) {
  return createAction<InteractionAction<K>>(type)
}

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

export const setRedirectUrl = createAccountAction(
  InteractionActionType.setRedirectUrl,
)
