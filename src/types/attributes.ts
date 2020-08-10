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
