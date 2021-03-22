import { DisplayCredential } from '~/types/credentials'

export enum CredentialActions {
  setCredentials = 'setCredentials',
  addCredentials = 'addCredentials',
  deleteCredential = 'deleteCredential',
}

export interface CredentialsState {
  all: DisplayCredential[]
}
