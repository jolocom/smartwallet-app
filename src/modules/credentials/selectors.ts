import { createSelector } from 'reselect'
import { mapDisplayToDocuments } from '~/hooks/signedCredentials/utils'
import { RootReducerI } from '~/types/reducer'

export const getAllCredentials = (state: RootReducerI) => state.credentials.all

export const getAllDocuments = createSelector(
  [getAllCredentials],
  mapDisplayToDocuments,
)
