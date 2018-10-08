export const uiCredentialTypeByType: {[key: string]: string} = {
  'ProofOfEmailCredential': 'Email',
  'ProofOfMobilePhoneNumberCredential': 'Mobile Phone',
  'ProofOfNameCredential': 'Name'
}

export const uiCategoryByCredentialType: {[key: string] : string[]} = {
  'Contact': [
    uiCredentialTypeByType.ProofOfEmailCredential,
    uiCredentialTypeByType.ProofOfMobilePhoneNumberCredential,
  ],
  'Personal': [
    uiCredentialTypeByType.ProofOfNameCredential
  ]
}

export enum Categories {
  Personal = 'Personal',
  Contact = 'Contact',
  Other = 'Other'
}

export const defaultUiCategories = Object.keys(uiCategoryByCredentialType)