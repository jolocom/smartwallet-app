import { CredentialOfferRenderInfo } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

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
  renderInfo: CredentialOfferRenderInfo
  invalid: boolean
  type: string
}
