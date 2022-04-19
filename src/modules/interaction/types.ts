import { FlowType } from 'react-native-jolocom'

import { OfferedCredential } from '~/types/credentials'
import { InteractionDetails } from './ssi/types'

export * from './ssi/types'

/*
 * Holds the mapped Flow state from the SDK's InteractionManager and additional
 * UI related state.
 *
 * @details - mapped flow state. If no active interaction, defaults to { flowType: null }
 * @selectedShareCredentials - mapping of selected {[type]: id} credentials within the interaction
 */
export interface InteractionState {
  ssi: InteractionDetails
  redirectUrl: string | null
}

export enum InteractionActionType {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  selectShareCredential = 'selectShareCredential',
  updateOfferValidation = 'updateOfferValidation',
  setRedirectUrl = 'setRedirectUrl',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface InteractionActions {
  [InteractionActionType.setInteractionDetails]: Omit<
    InteractionDetails,
    'flowType'
  > & { flowType?: FlowType | null }
  [InteractionActionType.resetInteraction]: undefined
  [InteractionActionType.selectShareCredential]: Record<string, string>
  [InteractionActionType.updateOfferValidation]: OfferedCredential[]
  [InteractionActionType.setRedirectUrl]: string | null
}

// Dependency between action type and its payload following Action type signature
export type InteractionAction<A extends keyof InteractionActions> = {
  type: A
  payload: InteractionActions[A]
}
