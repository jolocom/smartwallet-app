import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState, AttributeI } from '../attributes/types'
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
  | CredReceiveI

export interface InteractionStateI {
  details: {} | InteractionDetails
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
  selectedShareCredentials: { [x: string]: string }
}

interface InteractionCommonI {
  id: string
  counterparty: IdentitySummary
}

interface AuthCommonI extends InteractionCommonI {
  credentials?: never
}

export interface AuthenticationDetailsI extends AuthCommonI {
  flowType: FlowType.Authentication
  description: string
  image?: never
  action?: never
}

export interface AuthorizationDetailsI extends AuthCommonI {
  flowType: FlowType.Authorization
  description?: string
  image?: string
  action: string
}

interface CredCommonI extends InteractionCommonI {
  description?: never
  image?: never
  action?: never
}

export interface CredShareI extends CredCommonI {
  flowType: FlowType.CredentialShare
  credentials: {
    self_issued: string[]
    service_issued: string[]
  }
}

export interface CredReceiveI extends CredCommonI {
  flowType: FlowType.CredentialOffer
  credentials: {
    self_issued?: never
    service_issued: OfferUICredential[]
  }
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
