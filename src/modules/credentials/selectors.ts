import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialsByCategory,
  DisplayCredential,
  OtherCategory,
} from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
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
