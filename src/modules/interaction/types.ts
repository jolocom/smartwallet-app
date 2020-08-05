import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState, AttributeI } from '../attributes/types'
import { AttrKeys } from '~/types/attributes'

export enum InteractionActions {
  setInteractionDetails = 'setInteractionDetails',
  resetInteraction = 'resetInteraction',
  setInteractionAttributes = 'setInteractionAttributes',
  setInitialSelectedAttributes = 'setInitialSelectedAttributes',
  selectAttr = 'selectAttr',
  setIntermediaryState = 'setIntermediaryState',
  setAttributeInputKey = 'setAttributeInputKey',
}

export interface CounterpartyI {
  did: string
}

export interface InteractionStateI {
  details:
    | {}
    | AuthenticationDetailsI
    | AuthorizationDetailsI
    | CredShareI
    | CredReceiveI
  attributes: AttrsState<AttributeI>
  selectedAttributes: { [x: string]: string }
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
}

interface InteractionCommonI {
  id: string
  counterparty: CounterpartyI
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
