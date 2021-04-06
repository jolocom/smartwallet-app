import { KeyboardTypeOptions } from 'react-native'
import { BaseMetadata } from '@jolocom/protocol-ts'
import { ClaimEntry } from '@jolocom/protocol-ts/dist/lib/credential'
import { CredentialDisplay, DisplayVal } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { IdentitySummary } from '@jolocom/sdk'
import { ObjectSchema } from 'yup'

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
  value?: ClaimEntry
}

export interface IAttributeConfig<T = IAttributeClaimField> {
  // NOTE: if not used anywhere -> remove
  key: AttributeKeys
  label: string
  metadata: BaseMetadata
  fields: T[]
  validationSchema: ObjectSchema<Record<string, any>>
}

export type BaseUICredential = Pick<
  SignedCredential,
  'id' | 'issuer' | 'issued' | 'type' | 'expires' | 'subject' | 'name'
>

export type OfferedCredential = Pick<BaseUICredential, 'type' | 'name'> & {
  category: CredentialCategories
  invalid: boolean
}

export type OfferedCredentialDisplay = OfferedCredential &
  Pick<CredentialDisplay['display'], 'properties'>

export enum CredentialCategories {
  document = 'document',
  other = 'other',
}

export enum DocumentFields {
  DocumentName = 'Document Name',
}

export type DisplayCredential = Omit<BaseUICredential, 'issuer'> & {
  issuer: IdentitySummary
} & { category: CredentialCategories } & {
  properties: Array<Required<DisplayVal>>
}

export type DisplayCredentialDocument = DisplayCredential & {
  holderName: string
  photo?: string
  highlight?: string
}
export type DisplayCredentialOther = DisplayCredential & { photo?: string }

export type RequestedCredentialsByType<T> = { type: string; credentials: T[] }

export type CredentialsByCategory<T> = Record<CredentialCategories, T[]>

export type RequestedCredentialsByCategoryByType<T> = CredentialsByCategory<
  RequestedCredentialsByType<T>
>

export function isDocument(
  credential: DisplayCredentialDocument | DisplayCredentialOther,
): credential is DisplayCredentialDocument {
  return credential.category === CredentialCategories.document
}

export type TPrimitiveAttributesConfig = Omit<
  Record<AttributeTypes, IAttributeConfig>,
  AttributeTypes.businessCard
>

export type PrimitiveAttributeTypes = Exclude<
  AttributeTypes,
  AttributeTypes.businessCard
>
