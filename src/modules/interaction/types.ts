import { FlowType, IdentitySummary } from 'react-native-jolocom'
import {
  AttributeTypes,
  DisplayCredential,
  OfferedCredential,
} from '~/types/credentials'
import { AttributeI } from '../attributes/types'

export enum InteractionActions {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  selectShareCredential = 'selectShareCredential',
  updateOfferValidation = 'updateOfferValidation',
  setIntermediaryState = 'setIntermediaryState',
  setAttributeInputType = 'setAttributeInputType',
  setAusweisScannerKey = 'setAusweisScannerKey',
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
 * @selectedShareCredentials - mapping of selected {[type]: id} credentials within the interaction
 */
export interface InteractionState {
  details: InteractionDetails
  ausweisScannerKey: string | null
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
  id: null
  counterparty: null
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
  attributes: Partial<Record<AttributeTypes, AttributeI[]>>
  //TODO: should be renamed to smth else (not @credentials)
  credentials: DisplayCredential[]
  requestedTypes: string[]
  selectedCredentials: Record<string, string>
}

// TODO: get rid of nested service_issued
export interface CredOfferI extends InteractionCommonI {
  flowType: FlowType.CredentialOffer
  credentials: {
    service_issued: OfferedCredential[]
  }
}
