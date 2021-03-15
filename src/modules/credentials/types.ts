import { DisplayCredential } from '~/hooks/signedCredentials/types';

export enum CredentialActions {
  setCredentials = 'setCredentials',
  deleteCredential = 'deleteCredential',
}

export interface CredentialsState {
  all: DisplayCredential[]
}
