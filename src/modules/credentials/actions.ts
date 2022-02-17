import { DisplayCredential } from '~/types/credentials'
import createAction from '~/utils/createAction'
import { CredentialActions } from './types'

export const setCredentials = createAction<
  CredentialActions.setCredentials,
  DisplayCredential[]
>(CredentialActions.setCredentials)

export const addCredentials = createAction<
  CredentialActions.addCredentials,
  DisplayCredential[]
>(CredentialActions.addCredentials)

export const deleteCredential = createAction<
  CredentialActions.deleteCredential,
  string
>(CredentialActions.deleteCredential)
