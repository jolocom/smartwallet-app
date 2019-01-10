import { claimsMetadata, JolocomLib } from 'jolocom-lib'
import { uiCategoryByCredentialType, Categories, uiCredentialTypeByType } from './categories'
import { BaseMetadata } from 'cred-types-jolocom-core'
import { BackendMiddleware } from 'src/backendMiddleware'

export const getClaimMetadataByCredentialType = (type: string): BaseMetadata => {
  const uiType = Object.keys(uiCredentialTypeByType).find(item => uiCredentialTypeByType[item] === type)

  const relevantType = Object.keys(claimsMetadata).find(key => claimsMetadata[key].type[1] === uiType)

  if (!relevantType) {
    throw new Error("Unknown credential type, can't find metadata")
  }

  return claimsMetadata[relevantType]
}

export const getUiCredentialTypeByType = (type: string[]): string => {
  return uiCredentialTypeByType[type[1]] || prepareLabel(type[1])
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

export const areCredTypesEqual = (first: string[], second: string[]): boolean => {
  return first.every((el, index) => el === second[index])
}

export const prepareLabel = (label: string): string => {
  const words = label.split(/(?=[A-Z0-9])/)
  return words.length > 1 ? words.map(capitalize).join(' ') : capitalize(label)
}

export const capitalize = (word: string): string => `${word[0].toUpperCase()}${word.slice(1)}`

export const compareDates = (date1: Date, date2: Date): number => {
  return Math.floor(
    (Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()) -
      Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate())) /
      (1000 * 60 * 60 * 24)
  )
}

export const instantiateIdentityWallet = async (backendMiddleware: BackendMiddleware) => {
  const { keyChainLib, storageLib, encryptionLib } = backendMiddleware

  const password = await keyChainLib.getPassword()
  const decryptedSeed = encryptionLib.decryptWithPass({
    cipher: await storageLib.get.encryptedSeed(),
    pass: password
  })

  // TODO: rework the seed param on lib, currently cleartext seed is being passed around. Bad.
  const userVault = new JolocomLib.KeyProvider(Buffer.from(decryptedSeed, 'hex'), password)
  return await backendMiddleware.setIdentityWallet(userVault, password)
}
