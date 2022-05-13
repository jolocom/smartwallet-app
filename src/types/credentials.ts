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

export type OfferedCredential = Pick<BaseUICredential, 'type' | 'name'> & {
  properties: DisplayVal[]
}

export type OfferedCredentialDisplay = OfferedCredential &
  Pick<CredentialDisplay['display'], 'properties'>

export type DisplayCredential = { issuer: IdentitySummary | undefined } & {
  properties: Array<Required<DisplayVal>>
} & BaseUICredential

export type DisplayCredentialDocument = DisplayCredential & {
  holderName?: string
  photo?: string
  highlight?: string
}

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
