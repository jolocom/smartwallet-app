import { CredentialCategories, CredentialsByCategory, DisplayCredential } from "~/types/credentials"

export const categorizedCredentials = (credentials: DisplayCredential[]) => {
  return credentials.reduce<CredentialsByCategory<DisplayCredential>>(
    (sections, credential) => {
      if (credential.category === CredentialCategories.document) {
        sections[CredentialCategories.document] = [
          ...sections[CredentialCategories.document],
          credential,
        ]
      } else {
        sections[CredentialCategories.other] = [
          ...sections[CredentialCategories.other],
          credential,
        ]
      }

      return sections
    },
    { [CredentialCategories.document]: [], [CredentialCategories.other]: [] },
  )
}