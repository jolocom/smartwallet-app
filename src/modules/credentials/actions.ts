import { DisplayCredentialCustom } from '~/types/credentials'
import createAction from '~/utils/createAction'
import { CredentialActions } from './types'

export const setCredentials = createAction<DisplayCredentialCustom[]>(
  CredentialActions.setCredentials,
)

export const addCredentials = createAction<DisplayCredentialCustom[]>(
  CredentialActions.addCredentials,
)

export const deleteCredential = createAction<string>(
  CredentialActions.deleteCredential,
)
