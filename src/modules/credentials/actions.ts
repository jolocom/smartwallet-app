import createAction from '~/utils/createAction'
import { CredentialActions } from './types'
import { DisplayCredential } from '~/hooks/signedCredentials/types'

export const setCredentials = createAction<DisplayCredential[]>(
  CredentialActions.setCredentials,
)

export const deleteCredential = createAction<string>(
  CredentialActions.deleteCredential,
)
