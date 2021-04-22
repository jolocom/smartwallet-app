import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  mapCredentialsToCustomDisplay,
  reduceCustomDisplayCredentialsBySortedIssuer,
  reduceCustomDisplayCredentialsBySortedType,
  transformCategoriesTo,
} from '~/hooks/signedCredentials/utils'
import { categorizedCredentials } from '~/utils/categoriedCredentials'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) => categorizedCredentials(credentials)
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
