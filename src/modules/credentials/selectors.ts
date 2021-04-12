import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialCategories,
  CredentialsByCategory,
  DisplayCredential,
} from '~/types/credentials'
import {
  mapCredentialsToCustomDisplay,
  reduceCustomDisplayCredentialsBySortedIssuer,
  reduceCustomDisplayCredentialsBySortedType,
  transformCategoriesTo,
} from '~/hooks/signedCredentials/utils'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) =>
    credentials.reduce<CredentialsByCategory<DisplayCredential>>(
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
    ),
)

const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return transformCategoriesTo(cats)(mapCredentialsToCustomDisplay)
  },
)

export const getCustomCredentialsByCategoriesByType = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    const groupCategoriesByType = transformCategoriesTo(cats); 
    return groupCategoriesByType(reduceCustomDisplayCredentialsBySortedType)
  },
)

export const getCustomCredentialsByCategoriesByIssuer = createSelector(
  [getCustomCredentialsByCategories],
  (cats) => {
    const groupCategoriesByIssuer = transformCategoriesTo(cats)
    return groupCategoriesByIssuer(reduceCustomDisplayCredentialsBySortedIssuer)
  },
)
