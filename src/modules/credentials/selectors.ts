import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'
import { CredentialsBySection } from '~/types/credentials'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getCredentialsBySection = createSelector(
  getAllCredentials,
  (creds): CredentialsBySection =>
    creds.reduce<CredentialsBySection>(
      (acc, cred) => {
        if (cred.metadata.renderInfo && cred.metadata.renderInfo.renderAs) {
          acc.documents = [...acc.documents, cred]
        } else {
          acc.other = [...acc.other, cred]
        }

        return acc
      },
      { documents: [], other: [] },
    ),
)
