import {
  addCredentials,
  addFavoriteDocument,
  deleteCredential,
  deleteFavoriteDocument,
  hasDocuments,
  setCredentials,
  setFavoriteDocuments,
  setOpenedStack,
} from './actions'
import {
  CredentialsActionType,
  CredentialsState,
  DocumentStacks,
} from './types'

//TODO: check if additional nesting is required
const initialState: CredentialsState = {
  all: [],
  favorites: [],
  openedStack: DocumentStacks.Favorites,
  hasDocuments: false,
}

const credentialsReducer = (
  state = initialState,
  action: ReturnType<
    | typeof setCredentials
    | typeof addCredentials
    | typeof deleteCredential
    | typeof addFavoriteDocument
    | typeof deleteFavoriteDocument
    | typeof setFavoriteDocuments
    | typeof setOpenedStack
    | typeof hasDocuments
  >,
) => {
  switch (action.type) {
    case CredentialsActionType.setCredentials:
      return { ...state, all: action.payload }
    case CredentialsActionType.addCredentials:
      return action.payload
        ? { ...state, all: [...action.payload, ...state.all] }
        : state
    case CredentialsActionType.deleteCredential:
      const filtered = state.all.filter(c => c.id !== action.payload)
      return { ...state, all: filtered }
    case CredentialsActionType.addFavorite:
      return { ...state, favorites: [...state.favorites, action.payload] }
    case CredentialsActionType.deleteFavorite:
      const filteredFavorites = state.favorites.filter(
        id => id !== action.payload,
      )
      return { ...state, favorites: filteredFavorites }
    case CredentialsActionType.setFavorites:
      return { ...state, favorites: action.payload }
    case CredentialsActionType.setOpenedStack:
      return { ...state, openedStack: action.payload }
    case CredentialsActionType.hasDocuments: {
      return { ...state, hasDocuments: action.payload }
    }
    default:
      return state
  }
}

export default credentialsReducer
