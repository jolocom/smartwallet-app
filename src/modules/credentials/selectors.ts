import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsByCategory, DisplayCredential, DisplayCredentialDocument, DisplayCredentialOther, OtherCategory } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { mapDisplayToCustomDisplay } from '~/hooks/signedCredentials/utils'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) =>
  credentials.reduce<CredentialsByCategory<DisplayCredential>>(
      (sections, credential) => {
        if (
          credential.category === CredentialRenderTypes.document
        ) {
          sections[CredentialRenderTypes.document] = [...sections[CredentialRenderTypes.document], credential]
        } else {
          sections[OtherCategory.other] = [...sections[OtherCategory.other], credential]
        }

        return sections
      },
      { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] },
    ),
)

export const getCustomCredentialsByCategories = createSelector(
  [getCredentialsByCategories],
  (cats) => {
    return Object.keys(cats).reduce<CredentialsByCategory<DisplayCredentialDocument | DisplayCredentialOther>>((categories, catName) => {
      const categoryName = catName as CredentialRenderTypes.document | OtherCategory.other;
      categories[categoryName] = cats[categoryName].map(mapDisplayToCustomDisplay);
      return categories;
    }, { [CredentialRenderTypes.document]: [], [OtherCategory.other]: [] })
  }
)
