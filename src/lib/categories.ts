export enum CredentialTypes {
  Email = 'Email',
  MobilePhone = 'Mobile Phone',
  Name = 'Name',
  PostalAddress = 'Postal Address',
}

export enum Categories {
  Personal = 'Personal',
  Contact = 'Contact',
  Other = 'Other',
}

export const uiCredentialTypeByType: { [key: string]: string } = {
  ProofOfEmailCredential: CredentialTypes.Email,
  ProofOfMobilePhoneNumberCredential: CredentialTypes.MobilePhone,
  ProofOfNameCredential: CredentialTypes.Name,
  ProofOfPostalAddressCredential: CredentialTypes.PostalAddress,
}

export const uiCategoryByCredentialType: { [key: string]: string[] } = {
  Contact: [
    CredentialTypes.Email,
    CredentialTypes.MobilePhone,
    CredentialTypes.PostalAddress,
  ],
  Personal: [CredentialTypes.Name],
}

export const defaultUiCategories = Object.keys(uiCategoryByCredentialType)
