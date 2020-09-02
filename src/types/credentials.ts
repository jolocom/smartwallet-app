import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { IdentitySummary } from '@jolocom/sdk/js/src/lib/types'

export enum AttrKeys {
  emailAddress = 'emailAddress',
  mobilePhoneNumber = 'mobilePhoneNumber',
  name = 'name',
  postalAddress = 'postalAddress',
}

export type AttrKeysUpper = 'NAME' | 'EMAILADDRESS' | 'MOBILEPHONENUMBER'

export const ATTR_TYPES: { [x: string]: string } = {
  ProofOfEmailCredential: AttrKeys.emailAddress,
  ProofOfMobilePhoneNumberCredential: AttrKeys.mobilePhoneNumber,
  ProofOfNameCredential: AttrKeys.name,
}

export const ATTR_UI_NAMES: { [x: string]: string } = {
  [AttrKeys.emailAddress]: 'email',
  [AttrKeys.mobilePhoneNumber]: 'phone number',
  [AttrKeys.name]: 'name',
}

export const attrTypeToAttrKey = (type: string) => {
  const attrKey = ATTR_TYPES[type]
  if (!attrKey) throw new Error('No attribute key for type')

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
