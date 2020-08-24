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

// TODO: have @ServiceIssuedCredI, @UICredential and @CredentialShareCredential extend
// the same interface, hence share a structure. Will make separation by section more
// generic. Also the use of Credential Cards more consistent across the app.
interface ServiceIssuedCredI {
  type: string
  invalid: boolean
  renderInfo?: CredentialOfferRenderInfo
}

export interface CredReceiveI extends CredCommonI {
  flowType: FlowType.CredentialOffer
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
