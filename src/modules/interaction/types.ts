import { FlowType } from '@jolocom/sdk/js/interactionManager/types'
import { AttrKeys, OfferUICredential } from '~/types/credentials'
import { IdentitySummary } from '@jolocom/sdk/js/types'

export enum InteractionActions {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  selectShareCredential = 'selectShareCredential',
  setIntermediaryState = 'setIntermediaryState',
  setAttributeInputKey = 'setAttributeInputKey',
}

export type InteractionDetails =
  | AuthenticationDetailsI
  | AuthorizationDetailsI
  | CredShareI
  | CredOfferI
  | NotActiveInteractionDetailsI

/*
 * Holds the mapped Flow state from the SDK's InteractionManager and additional
 * UI related state.
 *
 * @details - mapped flow state. If no active interaction, defaults to { flowType: null }
 * @intermediaryState - status of the Intermediary ActionSheet
 * @attributeInputKey - the attribute type that should be created on the @IntermediaryActionSheet
 * @selectedShareCredentials - mapping of selected {[type]: id} credentials within the interaction
 */
export interface InteractionState {
  details: InteractionDetails
  intermediary: IntermediaryState
}

type IntermediaryState =
  | { sheetState: IntermediarySheetState.showing; attributeInputKey: AttrKeys }
  | {
      sheetState:
        | IntermediarySheetState.hiding
        | IntermediarySheetState.switching
      attributeInputKey: null
    }

/**
 * @showing - Shows the Intermediary ActionSheet
 * @hiding - Hides the Intermediary ActionSheet entirely
 * @switching - Hides the Intermediary ActionSheet before showing another ActionSheet
 */
export enum IntermediarySheetState {
  showing = 'showing',
  hiding = 'hiding',
  switching = 'switching',
}

/**
 * Common InteractionDetails properties across all interactions
 *
 * @id - unique interaction identifier (nonce)
 * @counterparty - the @IdentitySummary of the identity that initiated the interaction
 */
interface InteractionCommonI {
  id: string
  counterparty: IdentitySummary
}

/**
 * Default interaction state, if there are no active interactions
 */
export interface NotActiveInteractionDetailsI {
  flowType: null
}

export interface AuthenticationDetailsI extends InteractionCommonI {
  flowType: FlowType.Authentication
  description: string
}

export interface AuthorizationDetailsI extends InteractionCommonI {
  flowType: FlowType.Authorization
  description?: string
  imageURL?: string
  action: string
}

export interface CredShareI extends InteractionCommonI {
  flowType: FlowType.CredentialShare
  requestedAttributes: string[]
  //TODO: should be renamed to smth else (not @credentials)
  requestedCredentials: string[]
  selectedCredentials: Record<string, string>
}

export interface CredOfferI extends InteractionCommonI {
  flowType: FlowType.CredentialOffer
  credentials: {
    service_issued: OfferUICredential[]
  }
}
