import {
  FlowType,
  InteractionSummary,
} from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState, AttributeI } from '../attributes/types'
import { AttrKeys } from '~/types/attributes'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'

export enum InteractionActions {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  setInteractionAttributes = 'setInteractionAttributes',
  setAttributesToShare = 'setAttributesToShare',
  selectAttr = 'selectAttr',
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
  attributes: AttrsState<AttributeI>
  attributesToShare: { [x: string]: string }
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
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

interface ServiceIssuedCredI {
  type: string
  invalid: boolean
  renderAs: 'document' | 'other'
}

export interface CredReceiveI extends CredCommonI {
  flowType: FlowType.CredentialReceive
  credentials: {
    self_issued?: never
    service_issued: ServiceIssuedCredI[]
  }
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
