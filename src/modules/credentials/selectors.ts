import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsBySection, DisplayCredentialCustom } from '~/types/credentials'
import { CredentialRenderTypes } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getCredentialsBySection = createSelector(
  getAllCredentials,
  (creds): CredentialsBySection<DisplayCredentialCustom> =>
    creds.reduce<CredentialsBySection<DisplayCredentialCustom>>(
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
