import {
  OfferedCredential,
  OfferedCredentialDisplay,
  OtherCategory,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/types'
import { CredentialDisplay } from '@jolocom/sdk/js/credentials'

const updateCategory = (
  prevCategories: Record<
    CredentialRenderTypes.document | OtherCategory.other,
    OfferedCredential[]
  >,
  cb: (c: OfferedCredential) => OfferedCredentialDisplay,
) => {
  return (
    acc: Record<
      CredentialRenderTypes.document | OtherCategory.other,
      OfferedCredentialDisplay[]
    >,
    cName: string,
  ) => {
    const categoryName = cName as
      | CredentialRenderTypes.document
      | OtherCategory.other
    acc[categoryName] = prevCategories[categoryName].map(cb)
    return acc
  }
}

export const getOfferSections = (
  categories: Record<
    CredentialRenderTypes.document | OtherCategory.other,
    OfferedCredential[]
  >,
  details: CredentialDisplay[] | null,
) => {
  const getUpdatedCategoriesNoDetails = updateCategory(categories, (c) => ({
    ...c,
    properties: [],
  }))
  const getUpdatedCategoriesWDetails = updateCategory(categories, (c) => {
    const displayDetails = details?.find(
      (d) => d.type === c.type && (d.name === c.name || d.name === d.type),
    )
    return {
      ...c,
      properties: displayDetails?.display.properties ?? [],
    }
  })
  if (details === null) {
    return Object.keys(categories).reduce(getUpdatedCategoriesNoDetails, {
      [CredentialRenderTypes.document]: [],
      [OtherCategory.other]: [],
    })
  }

  return Object.keys(categories).reduce(getUpdatedCategoriesWDetails, {
    [CredentialRenderTypes.document]: [],
    [OtherCategory.other]: [],
  })
}
