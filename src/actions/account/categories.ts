// Why is this in actions >> TODO
export const uiCategoryByCredentialType: {[key: string] : string[][]} = {
  'Contact': [
    ['Credential', 'ProofOfEmailCredential'],
    ['Credential', 'ProofOfMobilePhoneNumberCredential'],
  ],
  'Personal': [
    ['Credential', 'ProofOfNameCredential'],
  ]
}

export enum Categories {
  Personal = 'Personal',
  Contact = 'Contact',
  Other = 'Other'
}

export const defaultUiCategories = Object.keys(uiCategoryByCredentialType)