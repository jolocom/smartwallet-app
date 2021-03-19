import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsByCategory, OtherCategory } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getCredentialsByCategories = createSelector(
  getAllCredentials,
  (credentials) =>
  credentials.reduce<CredentialsByCategory>(
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
