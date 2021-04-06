import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialsByCategory,
  DisplayCredential,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  CredentialCategories,
} from '~/types/credentials'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'

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

export const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return Object.keys(cats).reduce<
      CredentialsByCategory<DisplayCredentialDocument | DisplayCredentialOther>
    >(
      (categories, catName) => {
        const categoryName = catName as CredentialCategories
        categories[categoryName] = cats[categoryName].map(
          mapDisplayToCustomDisplay,
        )
        return categories
      },
      { [CredentialCategories.document]: [], [CredentialCategories.other]: [] },
    )
  },
)
