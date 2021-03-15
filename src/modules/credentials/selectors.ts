import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsBySection } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { DisplayCredential } from '~/hooks/signedCredentials/types'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getCredentialsBySection = createSelector(
  getAllCredentials,
  (creds): CredentialsBySection<DisplayCredential> =>
    creds.reduce<CredentialsBySection<DisplayCredential>>(
      (acc, cred) => {
        if (
          cred.renderInfo &&
          cred.renderInfo.renderAs === CredentialRenderTypes.document
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
