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

interface InteractionCommonStateI {
  id: string
  flowType: FlowType | null
  attributes: AttrsState<AttributeI>
  selectedAttributes: { [x: string]: string }
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
}

interface InitiatorI {
  initiator: {
    did: string
  }
}

interface AuthenticationDetailsI extends InitiatorI {
  description: string
}

interface AuthorizationDetailsI extends InitiatorI {
  description?: string
  image?: string
  action: string
}

interface IssuerI {
  issuer: {
    did: string
  }
}

interface CredShareI extends IssuerI {
  credentials: {
    self_issued: string[]
    service_issued: string[]
  }
}
interface CredReceiveI extends IssuerI {
  credentials: {
    service_issued: string[]
  }
}

export type AuthenticationInteractionStateT = InteractionCommonStateI &
  AuthenticationDetailsI
export type AuthorizationInteractionStateT = InteractionCommonStateI &
  AuthorizationDetailsI
export type CredShareInteractionStateT = InteractionCommonStateI & CredShareI
export type CredReceiveInteractionStateT = InteractionCommonStateI &
  CredReceiveI

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
