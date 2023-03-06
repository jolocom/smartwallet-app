import { Document } from '~/hooks/documents/types'

export enum CredentialsActionType {
  setCredentials = 'setCredentials',
  addCredentials = 'addCredentials',
  deleteCredential = 'deleteCredential',
  addFavorite = 'addFavorite',
  deleteFavorite = 'deleteFavorite',
  setFavorites = 'setFavorites',
  setOpenedStack = 'setOpenedStack',
  hasDocuments = 'hasDocuments',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface CredentialsActions {
  [CredentialsActionType.setCredentials]: Document[]
  [CredentialsActionType.addCredentials]: Document[]
  [CredentialsActionType.deleteCredential]: string
  [CredentialsActionType.addFavorite]: string
  [CredentialsActionType.deleteFavorite]: string
  [CredentialsActionType.setFavorites]: string[]
  [CredentialsActionType.setOpenedStack]: DocumentStacks | null
  [CredentialsActionType.hasDocuments]: boolean
}

// Dependency between action type and its payload following Action type signature
export type CredentialsAction<A extends keyof CredentialsActions> = {
  type: A
  payload: CredentialsActions[A]
}

export interface CredentialsState {
  all: Document[]
  favorites: string[]
  openedStack: DocumentStacks | null
  hasDocuments: boolean
}

export enum DocumentStacks {
  Favorites = 'favorites',
  All = 'all',
  Expired = 'expired',
}
