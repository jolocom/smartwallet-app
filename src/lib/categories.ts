export enum CredentialTypes {
  Email = 'Email',
  MobilePhone = 'Mobile Phone',
  Name = 'Name'
}

export const uiCredentialTypeByType: {[key: string]: string} = {
  'ProofOfEmailCredential': CredentialTypes.Email,
  'ProofOfMobilePhoneNumberCredential': CredentialTypes.MobilePhone,
  'ProofOfNameCredential': CredentialTypes.Name,
}

export const uiCategoryByCredentialType: {[key: string] : string[]} = {
  'Contact': [
    CredentialTypes.Email,
    CredentialTypes.MobilePhone,
  ],
  'Personal': [
    CredentialTypes.Name
  ]
}

export enum Categories {
  Personal = 'Personal',
  Contact = 'Contact',
  Other = 'Other'
}

export const defaultUiCategories = Object.keys(uiCategoryByCredentialType)