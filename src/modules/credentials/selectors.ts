import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsBySection, UICredential } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getCredentialsBySection = createSelector(
  getAllCredentials,
  (creds): CredentialsBySection<UICredential> =>
    creds.reduce<CredentialsBySection<UICredential>>(
      (acc, cred) => {
        if (
          cred.metadata.renderInfo &&
          cred.metadata.renderInfo.renderAs === CredentialRenderTypes.document
        ) {
          acc.documents = [...acc.documents, cred]
        } else {
          acc.other = [...acc.other, cred]
        }

        return acc
      },
      { documents: [], other: [] },
    ),
)
