import { FlowType } from '@jolocom/sdk/js/src/lib/interactionManager/types'
import { AttrsState, AttributeI } from '../attributes/types'
import { AttrKeys } from '~/types/credentials'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
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
  | CredOfferI
  | NotActiveInteractionDetailsI

export interface InteractionState {
  details: InteractionDetails
  attributes: AttrsState<AttributeI>
  attributesToShare: { [x: string]: string }
  intermediaryState: IntermediaryState
  attributeInputKey: AttrKeys | null
  selectedAttributes: SelectedAttributesT
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

interface ServiceIssuedCredI {
  type: string
  invalid: boolean
  renderInfo?: CredentialOfferRenderInfo
}

export interface CredOfferI extends InteractionCommonI {
  flowType: FlowType.CredentialOffer
  credentials: {
    service_issued: ServiceIssuedCredI[]
  }
}

export enum IntermediaryState {
  showing = 'showing',
  hiding = 'hiding',
  absent = 'absent',
}

export interface InteractionCredentialsBySection {
  documents: ServiceIssuedCredI[]
  other: ServiceIssuedCredI[]
}
