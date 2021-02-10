import createAction from '~/utils/createAction'
import { CredentialActions } from './types'
import { UICredential } from '~/types/credentials'

export const setCredentials = createAction<UICredential[]>(
  CredentialActions.setCredentials,
)

export const deleteCredential = createAction<string>(
  CredentialActions.deleteCredential,
)
