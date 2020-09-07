import { UICredential } from '~/types/credentials'

export enum CredentialActions {
  setCredentials = 'setCredentials',
}

export interface CredentialsState {
  all: UICredential[]
}
