import { createSelector } from 'reselect'
import { RootReducerI } from '~/types/reducer'

export const getAllDocuments = (state: RootReducerI) => state.credentials.all

export const getDocumentById = (id: string) =>
  createSelector([getAllDocuments], (documents) => {
    const doc = documents.find((d) => d.id === id)

    return doc
  })
