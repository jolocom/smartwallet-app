import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialsByCategory,
  DisplayCredential,
  OtherCategory,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { reduceCustomDisplayCredentialsByType, reduceCustomDisplayCredentialsByIssuer, mapCredentialsToCustomDisplay } from '~/hooks/signedCredentials/utils'

/**
 * Reduce categorized credentials to custom types `NT`
 * * `PT` - previous type
 * * `NT` - next type
 */
const transformCategoriesTo = <PT>(cats: CredentialsByCategory<PT>) => {
  return <NT>(processFn: (categories: PT[]) => NT[]) => {
    return Object.keys(cats).reduce<CredentialsByCategory<NT>>((categories, catName) => {
      const categoryName = catName as
      | CredentialRenderTypes.document
      | OtherCategory.other
      categories[categoryName] = processFn(cats[categoryName])
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

const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return transformCategoriesTo(cats)(mapCredentialsToCustomDisplay);
  },
)

export const getCustomCredentialsByCategoriesByType = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    return transformCategoriesTo(cats)(reduceCustomDisplayCredentialsByType)
  }
)

export const getCustomCredentialsByCategoriesByIssuer = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    return transformCategoriesTo(cats)(reduceCustomDisplayCredentialsByIssuer);
  }
)
