import { UICredential } from '~/types/credentials'

export enum CredentialActions {
  setCredentials = 'setCredentials',
  deleteCredential = 'deleteCredential',
}

export interface CredentialsState {
  all: UICredential[]
}
