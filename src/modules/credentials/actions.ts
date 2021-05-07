import { DisplayCredential } from '~/types/credentials'
import createAction from '~/utils/createAction'
import { CredentialActions } from './types'

export const setCredentials = createAction<DisplayCredential[]>(
  CredentialActions.setCredentials,
)

export const addCredentials = createAction<DisplayCredential[]>(
  CredentialActions.addCredentials,
)

export const deleteCredential = createAction<string>(
  CredentialActions.deleteCredential,
)