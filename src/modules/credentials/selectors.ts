import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialsByCategory,
  DisplayCredential,
  OtherCategory,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { mapDisplayToCustomDisplay, reduceCustomDisplayCredentialsByType, reduceCustomDisplayCredentialsByIssuer } from '~/hooks/signedCredentials/utils'

/**
 * Maps categorized credentials to custom types `NT`
 * * `PT` - previous type
 * * `NT` - next type
 */
const mapCategoriesTo = <PT>(cats: CredentialsByCategory<PT>) => {
  return <NT>(mapFn: (el: PT) => NT) => {
    return Object.keys(cats).reduce<CredentialsByCategory<NT>>((categories, catName) => {
      const categoryName = catName as
      | CredentialRenderTypes.document
      | OtherCategory.other
      categories[categoryName] = cats[categoryName].map(mapFn)
      return categories;
    }, { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] })
  }
}


/**
 * Reduce categorized credentials to custom types `NT`
 * * `PT` - previous type
 * * `NT` - next type
 */
const reduceCategoriesTo = <PT>(cats: CredentialsByCategory<PT>) => {
  // TODO: fix types
  return <NT>(reduceFn: (acc, v) => NT, initialValue) => {
    return Object.keys(cats).reduce<CredentialsByCategory<NT>>((categories, catName) => {
      const categoryName = catName as
      | CredentialRenderTypes.document
      | OtherCategory.other
      categories[categoryName] = cats[categoryName].reduce(reduceFn, initialValue)
      return categories;
    }, { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] })
  }
}


export const getAllCredentials = (state: RootReducerI) => state.credentials.all

const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) =>
    credentials.reduce<CredentialsByCategory<DisplayCredential>>(
      (sections, credential) => {
        if (credential.category === CredentialRenderTypes.document) {
          sections[CredentialRenderTypes.document] = [
            ...sections[CredentialRenderTypes.document],
            credential,
          ]
        } else {
          sections[OtherCategory.other] = [
            ...sections[OtherCategory.other],
            credential,
          ]
        }

        return sections
      },
      { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] },
    ),
)

export const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return mapCategoriesTo(cats)(mapDisplayToCustomDisplay);
  },
)

export const getCustomCredentialsByCategoriesByType = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    return reduceCategoriesTo(cats)(reduceCustomDisplayCredentialsByType, [])
  }
)

export const getCustomCredentialsByCategoriesByIssuer = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    return reduceCategoriesTo(cats)(reduceCustomDisplayCredentialsByIssuer, [])
  }
)
