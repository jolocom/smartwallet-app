export enum AttrKeys {
  name = 'name',
  email = 'email',
  number = 'number',
}

export type AttrKeysUpper = 'NAME' | 'EMAIL' | 'NUMBER'

export enum AttrTypes {
  ProofOfEmailCredential = 'ProofOfEmailCredential',
  ProofOfMobilePhoneNumberCredential = 'ProofOfMobilePhoneNumberCredential',
  ProofOfNameCredential = 'ProofOfNameCredential',
}
