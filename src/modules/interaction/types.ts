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

export interface InteractionStateI<T> {
  details: T
  attributes: AttrsState<AttributeI>
  selectedAttributes: { [x: string]: string }
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
}

interface InteractionCommonI {
  id: string
  flowType: FlowType | null
}

interface AuthCommonI extends InteractionCommonI {
  initiator: {
    did: string
  }
  issuer: {
    did: ''
  }
  credentials: {
    self_issued: []
    service_issued: []
    invalid: []
  }
}

export interface AuthenticationDetailsI extends AuthCommonI {
  description: string
  image: ''
  action: ''
}

export interface AuthorizationDetailsI extends AuthCommonI {
  description: string
  image: string
  action: string
}

interface CredCommonI extends InteractionCommonI {
  initiator: {
    did: ''
  }
  issuer: {
    did: string
  }
  description: ''
  image: ''
  action: ''
}

export interface CredShareI extends CredCommonI {
  credentials: {
    self_issued: string[]
    service_issued: string[]
    invalid: []
  }
}

export interface CredReceiveI extends CredCommonI {
  credentials: {
    self_issued: []
    service_issued: string[]
    invalid: string[]
  }
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}
