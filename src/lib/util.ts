import { claimsMetadata } from 'jolocom-lib'
import { IClaimMetadata } from 'jolocom-lib/js/credentials/credential/types';
import { uiCategoryByCredentialType, Categories } from '../actions/account/categories';

export const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

export const getClaimMetadataByCredentialType = (type: string[]) : IClaimMetadata => {
  const relevantType = Object.keys(claimsMetadata).find(key => areCredTypesEqual(claimsMetadata[key].type, type))

  if (!relevantType) {
    throw new Error("Unknown credential type, can't find metadata")
  }

  return claimsMetadata[relevantType]
}

export const getCredentialUiCategory = (type: string[]): string => {
  const uiCategories = Object.keys(uiCategoryByCredentialType)

  const category = uiCategories.find(uiCategory => {
    const categoryDefinition = uiCategoryByCredentialType[uiCategory]
    const credentialFitsDefinition = categoryDefinition.some(entry => areCredTypesEqual(entry, type))
    return credentialFitsDefinition
  })

  return category || Categories.Other
}