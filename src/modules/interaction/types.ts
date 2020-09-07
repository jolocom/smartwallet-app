import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrKeys, OfferUICredential } from '~/types/credentials'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'

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

export interface InteractionState {
  details: InteractionDetails
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
  selectedShareCredentials: { [x: string]: string }
}

export type SelectedAttributesT = { [x: string]: string }

interface InteractionCommonI {
  id: string
  counterparty: IdentitySummary
}

// default state of details prop in interaction
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
  image?: string
  action: string
}

export interface CredShareI extends InteractionCommonI {
  flowType: FlowType.CredentialShare
  credentials: {
    self_issued: string[]
    service_issued: string[]
  }
}

export interface CredOfferI extends InteractionCommonI {
  flowType: FlowType.CredentialOffer
  credentials: {
    service_issued: OfferUICredential[]
  }
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
