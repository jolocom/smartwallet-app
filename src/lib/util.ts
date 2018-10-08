import { claimsMetadata } from 'jolocom-lib'
import { uiCategoryByCredentialType, Categories, uiCredentialTypeByType } from './categories'
import { BaseMetadata } from 'cred-types-jolocom-core'

export const getClaimMetadataByCredentialType = (type: string) : BaseMetadata => {
  const uiType = Object.keys(uiCredentialTypeByType)
    .find(item => uiCredentialTypeByType[item] === type)

  const relevantType = Object.keys(claimsMetadata)
    .find(key => claimsMetadata[key].type[1] === uiType)

  if (!relevantType) {
    throw new Error("Unknown credential type, can't find metadata")
  }

  return claimsMetadata[relevantType]
}

export const getUiCredentialTypeByType = (type: string[]): string => {
  return uiCredentialTypeByType[type[1]]
}

export const getCredentialUiCategory = (type: string): string => {
  const uiCategories = Object.keys(uiCategoryByCredentialType)

  const category = uiCategories.find(uiCategory => {
    const categoryDefinition = uiCategoryByCredentialType[uiCategory]
    const credentialFitsDefinition = categoryDefinition.some(entry => entry === type)
    return credentialFitsDefinition
  })

  return category || Categories.Other
}