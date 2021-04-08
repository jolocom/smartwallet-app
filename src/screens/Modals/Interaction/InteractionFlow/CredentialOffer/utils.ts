import {
  OfferedCredential,
  OfferedCredentialDisplay,
  CredentialCategories,
} from '~/types/credentials'
import { CredentialDisplay } from '@jolocom/sdk/js/credentials'

const updateCategory = (
  prevCategories: Record<CredentialCategories, OfferedCredential[]>,
  cb: (c: OfferedCredential) => OfferedCredentialDisplay,
) => {
  return (
    acc: Record<CredentialCategories, OfferedCredentialDisplay[]>,
    cName: string,
  ) => {
    const categoryName = cName as CredentialCategories
    acc[categoryName] = prevCategories[categoryName].map(cb)
    return acc
  }
}

export const getOfferSections = (
  categories: Record<CredentialCategories, OfferedCredential[]>,
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
      [CredentialCategories.document]: [],
      [CredentialCategories.other]: [],
    })
  }

  return Object.keys(categories).reduce(getUpdatedCategoriesWDetails, {
    [CredentialCategories.document]: [],
    [CredentialCategories.other]: [],
  })
}
