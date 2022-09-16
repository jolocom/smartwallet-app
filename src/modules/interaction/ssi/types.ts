import { FlowType, IdentitySummary } from 'react-native-jolocom'
import { Document } from '~/hooks/documents/types'
import { AttributeI } from '~/modules/attributes/types'
import { AttributeTypes, OfferedCredential } from '~/types/credentials'

export type InteractionDetails =
  | AuthenticationDetailsI
  | AuthorizationDetailsI
  | CredShareI
  | CredOfferI
  | NotActiveInteractionDetailsI

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
  credentials: Document[]
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
