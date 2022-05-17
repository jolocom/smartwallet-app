import { createSelector } from 'reselect'
import {
  mapDisplayToDocuments,
  sortCredentialsByRecentIssueDate,
} from '~/hooks/signedCredentials/utils'
import { RootReducerI } from '~/types/reducer'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getAllDocuments = createSelector(
  [getAllCredentials],
  (documents) => {
    const sorted = sortCredentialsByRecentIssueDate(documents)
    const docs = mapDisplayToDocuments(sorted)

    return docs
  },
)
