import { KeyboardTypeOptions } from 'react-native'
import {  CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'
import { CredentialDisplay } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

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

export type BaseUICredential = Pick<SignedCredential, 'id' |  'issuer' | 'issued' | 'type' | 'expires' | 'subject' | 'name'>

export type OfferedCredential =
  & Pick<BaseUICredential, 'type'>
  & {category:CredentialCategory, invalid: boolean}

export enum DocumentTypes {
  document = 'document',
  other = 'other',
}

export enum DocumentFields {
  DocumentName = 'Document Name',
}

export enum OtherCategory {
  other = 'other'
}
export type CredentialCategory = CredentialRenderTypes |  OtherCategory

export type DisplayCredential =
& BaseUICredential
& {category: CredentialCategory}
& Pick<CredentialDisplay['display'], 'properties'>

export type DisplayCredentialDocument = 
  & DisplayCredential
  & { holderName: string, photo?: string, highlight?: string}
export type DisplayCredentialOther = DisplayCredential & {photo?: string}

export type RequestedCredentialsByType<T> = {type: string, credentials: T[]}

export type CredentialsByCategory<T> = Record<OtherCategory.other | CredentialRenderTypes.document, T[]>

export type RequestedCredentialsByCategoryByType<T> = CredentialsByCategory<RequestedCredentialsByType<T>>

export function isDocument(credential: DisplayCredentialDocument |  DisplayCredentialOther): credential is DisplayCredentialDocument {
  return credential.category === CredentialRenderTypes.document;
}