import { DisplayCredential } from '~/types/credentials'

export enum CredentialsActionType {
  setCredentials = 'setCredentials',
  addCredentials = 'addCredentials',
  deleteCredential = 'deleteCredential',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface CredentialsActions {
  [CredentialsActionType.setCredentials]: DisplayCredential[]
  [CredentialsActionType.addCredentials]: DisplayCredential[]
  [CredentialsActionType.deleteCredential]: string
}

// Dependency between action type and its payload following Action type signature
export type CredentialsAction<A extends keyof CredentialsActions> = {
  type: A
  payload: CredentialsActions[A]
}

export interface CredentialsState {
  all: DisplayCredential[]
}
