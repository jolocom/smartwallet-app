import { Interaction } from './interaction'
import { CredentialOffer } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { IdentitySummary } from '../../actions/sso/types'

export type FlowState =
  | AuthenticationFlowState
  | CredentialRequestFlowState
  | CredentialOfferFlowState

// TODO @clauxx rename this
export interface InteractionState {
  [nonce: string]: Interaction
}

// TODO @clauxx make generic???
export interface InteractionSummary {
  issuer: IdentitySummary
  state: FlowState
}

export enum InteractionChannel {
  QR = 'QR',
  Deeplink = 'Deeplink',
  HTTP = 'HTTP',
  Bluetooth = 'Bluetooth',
  NFC = 'NFC',
}

export type AuthenticationFlowState = string
export type CredentialRequestFlowState = CredentialTypeSummary[]
export type CredentialOfferFlowState = OfferWithValidity[]

export interface CredentialTypeSummary {
  type: string
  values: string[]
  verifications: CredentialVerificationSummary[]
}

export interface CredentialVerificationSummary {
  id: string
  issuer: IdentitySummary
  selfSigned: boolean
  expires: string | undefined | Date
}

export interface AttributeSummary {
  type: string[]
  results: Array<{
    verification: string
    fieldName: string
    values: string[]
  }>
}

type ValidationErrorMap = {
  invalidIssuer?: boolean
  invalidSubject?: boolean
}

export interface SignedCredentialWithMetadata extends CredentialOffer {
  signedCredential?: SignedCredential
}

export type OfferWithValidity = SignedCredentialWithMetadata & {
  validationErrors: ValidationErrorMap
}
