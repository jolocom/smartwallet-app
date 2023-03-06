import createAction from '~/utils/createAction'
import {
  CredentialsAction,
  CredentialsActions,
  CredentialsActionType,
} from './types'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `credentials` module
function createCredentialsAction<K extends keyof CredentialsActions>(type: K) {
  return createAction<CredentialsAction<K>>(type)
}

export const setCredentials = createCredentialsAction(
  CredentialsActionType.setCredentials,
)

export const addCredentials = createCredentialsAction(
  CredentialsActionType.addCredentials,
)

export const deleteCredential = createCredentialsAction(
  CredentialsActionType.deleteCredential,
)

export const addFavoriteDocument = createCredentialsAction(
  CredentialsActionType.addFavorite,
)

export const deleteFavoriteDocument = createCredentialsAction(
  CredentialsActionType.deleteFavorite,
)

export const setFavoriteDocuments = createCredentialsAction(
  CredentialsActionType.setFavorites,
)

export const setOpenedStack = createCredentialsAction(
  CredentialsActionType.setOpenedStack,
)

export const setHasDocuments = createCredentialsAction(
  CredentialsActionType.hasDocuments,
)
