import { KeyboardTypeOptions } from 'react-native'
import { IdentitySummary } from 'react-native-jolocom'
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { BaseMetadata } from 'cred-types-jolocom-core'

export enum AttributeKeys {
  emailAddress = 'emailAddress',
  mobilePhoneNumber = 'mobilePhoneNumber',
  name = 'name',
  postalAddress = 'postalAddress',
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
}

export enum AttributeTypes {
  emailAddress = 'ProofOfEmailCredential',
  mobilePhoneNumber = 'ProofOfMobilePhoneNumberCredential',
  name = 'ProofOfNameCredential',
  postalAddress = 'ProofOfPostalAddressCredential',
}

export interface IAttributeClaimField {
  key: ClaimKeys
  keyboardType: KeyboardTypeOptions
  label: string
}

export interface IAttributeConfig {
  // NOTE: if not used anywhere -> remove
  key: AttributeKeys
  label: string
  metadata: BaseMetadata
  fields: IAttributeClaimField[]
}

// NOTE: @renderInfo is not part of the @metadata property b/c the metadata properties
// are only available for @SignedCredentials, while for Credential Offer @renderInfo would still
// be needed. Hence, it should be available at the base of the @UICredential.
export interface BaseUICredential {
  type: string
  issuer: IdentitySummary
  renderInfo: CredentialOfferRenderInfo | undefined
}

export type UICredentialMetadata = Pick<
  SignedCredential,
  'name' | 'expires' | 'issued'
>

export interface UICredential
  extends BaseUICredential,
    Pick<SignedCredential, 'id' | 'claim'> {
  metadata: UICredentialMetadata
}

export enum CredentialSection {
  Documents = 'documents',
  Other = 'other',
}

export interface CredentialsBySection<T> {
  [CredentialSection.Documents]: T[]
  [CredentialSection.Other]: T[]
}

export type ShareUICredential = Omit<UICredential, 'claim'>

export interface MultipleShareUICredential
  extends Pick<ShareUICredential, 'type'> {
  credentials: ShareUICredential[]
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
