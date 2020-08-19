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

export const ATTR_TYPES = {
  ProofOfEmailCredential: AttrKeys.emailAddress,
  ProofOfMobilePhoneNumberCredential: AttrKeys.mobilePhoneNumber,
  ProofOfNameCredential: AttrKeys.name,
}

export enum CredentialSectionsUpper {
  DOCUMENTS = 'DOCUMENTS',
  OTHER = 'OTHER',
}

export interface ServiceIssuedCredI {
  renderInfo?: CredentialOfferRenderInfo
  invalid: boolean
  type: string
}

export const ATTR_UI_NAMES: { [x: string]: string } = {
  ProofOfEmailCredential: 'email',
  ProofOfMobilePhoneNumberCredential: 'phone number',
  ProofOfNameCredential: 'name',
}

interface UICredentialMetadata
  extends Pick<SignedCredential, 'name' | 'expires' | 'issued'> {
  renderInfo: CredentialOfferRenderInfo | undefined
}

export interface UICredential extends Pick<SignedCredential, 'id' | 'claim'> {
  metadata: UICredentialMetadata
  issuer: IdentitySummary
}
