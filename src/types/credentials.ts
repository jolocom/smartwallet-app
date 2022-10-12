import {
  BaseMetadata,
  ClaimEntry,
  CredentialDefinition,
} from '@jolocom/protocol-ts'
import { IdentitySummary } from '@jolocom/sdk'
import { CredentialDisplay, DisplayVal } from '@jolocom/sdk/js/credentials'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { KeyboardTypeOptions } from 'react-native'
import { ObjectSchema } from 'yup'
import { Document } from '~/hooks/documents/types'

export enum AttributeKeys {
  emailAddress = 'emailAddress',
  mobilePhoneNumber = 'mobilePhoneNumber',
  name = 'name',
  postalAddress = 'postalAddress',
}

export enum SpecialDocumentKeys {
  givenName = '$.givenName',
  familyName = '$.familyName',
  given_name = '$.given_name',
  family_name = '$.family_name',
  photo = '$.photo',
  portrait = '$.portrait',
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
}

export enum AttributeTypes {
  emailAddress = 'ProofOfEmailCredential',
  mobilePhoneNumber = 'ProofOfMobilePhoneNumberCredential',
  name = 'ProofOfNameCredential',
  postalAddress = 'ProofOfPostalAddressCredential',
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
  // eslint-disable-next-line
  validationSchema: ObjectSchema<Record<string, any>>
}

// NOTE: removed issuer as we are getting resolved issued from credentialType
export type BaseUICredential = Pick<
  SignedCredential,
  'id' | 'issued' | 'expires' | 'subject' | 'name'
> & { type: string }

export type OfferedCredential = Pick<
  Document,
  'type' | 'name' | 'previewKeys' | 'issuer' | 'style' | 'properties'
>

export type OfferedCredentialDisplay = OfferedCredential &
  Pick<CredentialDisplay['display'], 'properties'>

export type DisplayCredential = { issuer: IdentitySummary | undefined } & {
  properties: Array<DisplayVal>
  previewKeys: Array<string>
  styles?: CredentialDefinition['styles']
  holderName?: string
  photo?: string
  issuerIcon?: string
  icons: string[]
} & BaseUICredential

export type CredentialsBy<BT, CT> = {
  key: BT
  value: string
  credentials: CT[]
}
export type CredentialsByType<T> = CredentialsBy<'type', T>

export type TPrimitiveAttributesConfig = Record<
  AttributeTypes,
  IAttributeConfig
>

export type PrimitiveAttributeTypes = AttributeTypes
