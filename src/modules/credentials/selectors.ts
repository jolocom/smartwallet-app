import { createSelector } from 'reselect'
import { Document } from '~/hooks/documents/types'
import { RootReducerI } from '~/types/reducer'

const findById = (id: string) => (documents: Document[]) => {
  return documents.find(d => d.id === id)
}

const isDocumentExpired = (document: Document) =>
  document.expires.getTime() < Date.now()

export const getAllDocuments = (state: RootReducerI) => state.credentials.all

export const getValidDocuments = createSelector(getAllDocuments, documents => {
  return documents.filter(document => !isDocumentExpired(document))
})

export const getExpiredDocuments = (state: RootReducerI) =>
  state.credentials.all.filter(isDocumentExpired)

export const getDocumentById = (id: string) => (state: RootReducerI) => {
  const doc = findById(id)(state.credentials.all)

  return doc
}

export const getFavoriteDocuments = (state: RootReducerI) => {
  return state.credentials.all.filter(document =>
    state.credentials.favorites.includes(document.id),
  )
}

export const getOpenedStack = (state: RootReducerI) =>
  state.credentials.openedStack

export const getHasDocuments = (state: RootReducerI) =>
  state.credentials.hasDocuments
