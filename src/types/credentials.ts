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

/**
 * #### NOTE/FIXME
 * > every time offered credential types changes we need to update this value
 */
export enum IdentificationTypes {
  ProofOfIdCredentialDemo = 'ProofOfIdCredentialDemo',
  ProofOfDriverLicenceDemo = 'ProofOfDriverLicenceDemo',
}
export enum TicketTypes {
  ProofOfTicketDemo = 'ProofOfTicketDemo',
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

// NOTE: removed issuer as we are getting resolved issued from credentialType
export type BaseUICredential = Pick<
  SignedCredential,
  'id' | 'issued' | 'expires' | 'subject' | 'name'
> & { type: string }

export type OfferedCredential = Pick<BaseUICredential, 'type' | 'name'> & {
  category: CredentialCategories
  invalid: boolean
  properties: Array<DisplayVal>
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

export type DisplayCredential = { issuer: IdentitySummary | undefined } & {
  category: CredentialCategories
} & { properties: Array<Required<DisplayVal>> } & BaseUICredential

export type DisplayCredentialDocument = DisplayCredential & {
  holderName: string
  photo?: string
  highlight?: string
}
export type DisplayCredentialOther = DisplayCredential & { photo?: string }

export type CredentialsBy<BT, CT> = {
  key: BT
  value: string
  credentials: CT[]
}
export type CredentialsByType<T> = CredentialsBy<'type', T>
export type CredentialsByIssuer<T> = CredentialsBy<'issuer', T>

export type CredentialsByCategory<T> = Record<CredentialCategories, T[]>

export type RequestedCredentialsByCategoryByType<T> = CredentialsByCategory<
  CredentialsByType<T>
>

export function isDocument(
  credential: DisplayCredentialDocument | DisplayCredentialOther,
): credential is DisplayCredentialDocument {
  return credential.category === CredentialCategories.document
}

export type TPrimitiveAttributesConfig = Record<
  AttributeTypes,
  IAttributeConfig
>

export type PrimitiveAttributeTypes = AttributeTypes
