import { KeyboardTypeOptions } from 'react-native'
import { IdentitySummary } from 'react-native-jolocom'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'

export enum AttributeKeys {
  emailAddress = 'emailAddress',
  mobilePhoneNumber = 'mobilePhoneNumber',
  name = 'name',
  postalAddress = 'postalAddress',
  businessCard = 'businessCard', // TODO: update to actual value
}

export enum ClaimKeys {
  givenName = 'givenName',
  familyName = 'familyName',
  email = 'email',
  addressLine = 'addressLine1',
  postalCode = 'postalCode',
  city = 'city',
  country = 'country',
  telephone = 'telephone',
  id = 'id',
  photo = 'photo',
  legalCompanyName = 'legalCompanyName',
}

export enum AttributeTypes {
  emailAddress = 'ProofOfEmailCredential',
  mobilePhoneNumber = 'ProofOfMobilePhoneNumberCredential',
  name = 'ProofOfNameCredential',
  postalAddress = 'ProofOfPostalAddressCredential',
  businessCard = 'ProofOfBusinessCardCredential', // TODO: update to actual value
}

interface AttributeKeyboardOptions {
  keyboardType: KeyboardTypeOptions
  autoCapitalize: 'none' | 'words' | 'sentences' | 'characters'
}

export interface IAttributeClaimField {
  key: ClaimKeys
  label: string
  keyboardOptions: AttributeKeyboardOptions
}

export interface IAttributeClaimFieldWithValue extends IAttributeClaimField {
  value: ClaimEntry
}

export interface IAttributeConfig<T = IAttributeClaimField> {
  // NOTE: if not used anywhere -> remove
  key: AttributeKeys
  label: string
  metadata: BaseMetadata
  fields: T[]
}

// NOTE: @renderInfo is not part of the @metadata property b/c the metadata properties
// are only available for @SignedCredentials, while for Credential Offer @renderInfo would still
// be needed. Hence, it should be available at the base of the @UICredential.
export interface BaseUICredential {
  type: string
  issuer: IdentitySummary
  renderInfo: CredentialOfferRenderInfo | undefined
}

// TODO: remove for consistency and use DocumentTypes instead
export enum CredentialSection {
  Documents = 'documents',
  Other = 'other',
}

export type CredentialsBySection<T> = Record<CredentialSection, T[]>

export interface MultipleShareUICredential {
  type: string
  credentials: DisplayCredential[]
}

export type ShareCredentialsBySection = CredentialsBySection<MultipleShareUICredential>

export interface OfferUICredential extends BaseUICredential {
  invalid: boolean
}

export enum DocumentTypes {
  document = 'document',
  other = 'other',
}

export enum DocumentFields {
  DocumentName = 'Document Name',
}


// TODO: remove when types on sdk are fixed
export interface  DisplayVal {
  key: string,
  label: string,
  value: string | number
}
export type DisplayCredential = 
  & {id: string, holderName?: string, photo?: string, properties: DisplayVal[]}
  & BaseUICredential
  & Pick<BaseMetadata, 'name'> 
