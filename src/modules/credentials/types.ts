import { DisplayCredentialCustom } from "~/types/credentials";

export enum CredentialActions {
  setCredentials = 'setCredentials',
  addCredential = 'addCredential',
  deleteCredential = 'deleteCredential',
}

export interface CredentialsState {
  all: DisplayCredentialCustom[]
}
