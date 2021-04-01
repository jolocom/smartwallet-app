import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import {
  CredentialsByCategory,
  DisplayCredential,
  DisplayCredentialDocument,
  DisplayCredentialOther,
  DocumentTypes,
} from '~/types/credentials'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) =>
    credentials.reduce<CredentialsByCategory<DisplayCredential>>(
      (sections, credential) => {
        if (credential.category === DocumentTypes.document) {
          sections[DocumentTypes.document] = [
            ...sections[DocumentTypes.document],
            credential,
          ]
        } else {
          sections[DocumentTypes.other] = [
            ...sections[DocumentTypes.other],
            credential,
          ]
        }

        return sections
      },
      { [DocumentTypes.document]: [], [DocumentTypes.other]: [] },
    ),
)

export const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return Object.keys(cats).reduce<
      CredentialsByCategory<DisplayCredentialDocument | DisplayCredentialOther>
    >(
      (categories, catName) => {
        const categoryName = catName as DocumentTypes
        categories[categoryName] = cats[categoryName].map(
          mapDisplayToCustomDisplay,
        )
        return categories
      },
      { [DocumentTypes.document]: [], [DocumentTypes.other]: [] },
    )
  },
)
