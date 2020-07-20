import { BaseMetadata } from 'cred-types-jolocom-core'
import { claimsMetadata } from 'jolocom-lib'

export enum CredentialTypes {
  Email = 'Email',
  MobilePhone = 'Mobile Phone',
  Name = 'Name',
  PostalAddress = 'Postal Address',
}

export const uiCredentialTypeByType: { [key: string]: string } = {
  ProofOfEmailCredential: CredentialTypes.Email,
  ProofOfMobilePhoneNumberCredential: CredentialTypes.MobilePhone,
  ProofOfNameCredential: CredentialTypes.Name,
  ProofOfPostalAddressCredential: CredentialTypes.PostalAddress,
}


export const getClaimMetadataByCredentialType = (
  type: string,
): BaseMetadata => {
  const uiType = Object.keys(uiCredentialTypeByType).find(
    item => uiCredentialTypeByType[item] === type,
  )
  const relevantType = Object.keys(claimsMetadata).find(
    key => claimsMetadata[key].type[1] === uiType,
  )

  if (!relevantType) {
    throw new Error("Unknown credential type, can't find metadata")
  }

  return claimsMetadata[relevantType]
}