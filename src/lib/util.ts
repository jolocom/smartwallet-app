import { claimsMetadata } from 'jolocom-lib'
import { uiCategoryByCredentialType, Categories, uiCredentialTypeByType } from './categories'
import { BaseMetadata } from 'cred-types-jolocom-core'

export const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

export const getClaimMetadataByCredentialType = (type: string[]) : BaseMetadata => {
  const relevantType = Object.keys(claimsMetadata).find(key => areCredTypesEqual(claimsMetadata[key].type, type))

  if (!relevantType) {
    throw new Error("Unknown credential type, can't find metadata")
  }

  return claimsMetadata[relevantType]
}

export const getUiCredentialTypeByType = (type: string[]) => {
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