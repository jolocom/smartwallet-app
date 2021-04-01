import {
  OfferedCredential,
  OfferedCredentialDisplay,
  DocumentTypes,
} from '~/types/credentials'
import { CredentialDisplay } from '@jolocom/sdk/js/credentials'

const updateCategory = (
  prevCategories: Record<DocumentTypes, OfferedCredential[]>,
  cb: (c: OfferedCredential) => OfferedCredentialDisplay,
) => {
  return (
    acc: Record<DocumentTypes, OfferedCredentialDisplay[]>,
    cName: string,
  ) => {
    const categoryName = cName as DocumentTypes
    acc[categoryName] = prevCategories[categoryName].map(cb)
    return acc
  }
}

export const getOfferSections = (
  categories: Record<DocumentTypes, OfferedCredential[]>,
  details: CredentialDisplay[] | null,
) => {
  const getUpdatedCategoriesNoDetails = updateCategory(categories, (c) => ({
    ...c,
    properties: [],
  }))
  const getUpdatedCategoriesWDetails = updateCategory(categories, (c) => {
    const displayDetails = details?.find(
      (d) => d.type === c.type[1] && (d.name === c.name || d.name === d.type),
    )
    return {
      ...c,
      properties: displayDetails?.display.properties ?? [],
    }
  })
  if (details === null) {
    return Object.keys(categories).reduce(getUpdatedCategoriesNoDetails, {
      [DocumentTypes.document]: [],
      [DocumentTypes.other]: [],
    })
  }

  return Object.keys(categories).reduce(getUpdatedCategoriesWDetails, {
    [DocumentTypes.document]: [],
    [DocumentTypes.other]: [],
  })
}
