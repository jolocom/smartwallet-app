import { KeyboardTypeOptions } from 'react-native'

import { IdentitySummary } from 'react-native-jolocom'

// FIXME: expose these types from react-native-jolocom
import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'

export enum AttrKeys {
  emailAddress = 'emailAddress',
  mobilePhoneNumber = 'mobilePhoneNumber',
  name = 'name',
  postalAddress = 'postalAddress',
}

export type AttrKeysUpper = 'NAME' | 'EMAILADDRESS' | 'MOBILEPHONENUMBER'

//TODO: add support for Postal Address
export const ATTR_TYPES: Record<string, AttrKeys> = {
  ProofOfEmailCredential: AttrKeys.emailAddress,
  ProofOfMobilePhoneNumberCredential: AttrKeys.mobilePhoneNumber,
  ProofOfNameCredential: AttrKeys.name,
}

export const ATTR_UI_NAMES: Record<string, string> = {
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'phone number',
  [AttrKeys.name]: 'name',
}

export const ATTR_KEYBOARD_TYPE: Record<AttrKeys, KeyboardTypeOptions> = {
  [AttrKeys.emailAddress]: 'email-address',
  [AttrKeys.mobilePhoneNumber]: 'phone-pad',
  [AttrKeys.name]: 'default',
  [AttrKeys.postalAddress]: 'default',
}

export const attrTypeToAttrKey = (type: string) => {
  const attrKey = ATTR_TYPES[type]
  if (!attrKey) return null

  return attrKey
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

export type ShareCredentialsBySection = CredentialsBySection<
  MultipleShareUICredential
>

export interface OfferUICredential extends BaseUICredential {
  invalid: boolean
}
