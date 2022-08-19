import { createSelector } from 'reselect'
import { Document } from '~/hooks/documents/types'
import { RootReducerI } from '~/types/reducer'

// TODO: uncomment!
// const isDocumentExpired = (document: Document) =>
//   document.expires.getTime() < Date.now()

const isDocumentExpired = (document: Document) =>
  document.name === 'Expired document'

export const getAllDocuments = (state: RootReducerI) => state.credentials.all

export const getValidDocuments = createSelector(
  getAllDocuments,
  (documents) => {
    return documents.filter((document) => !isDocumentExpired(document))
  },
)

export const getExpiredDocuments = (state: RootReducerI) =>
  state.credentials.all.filter(isDocumentExpired)

export const getDocumentById = (id: string) =>
  createSelector([getAllDocuments], (documents) => {
    const doc = documents.find((d) => d.id === id)

    return doc
  })
