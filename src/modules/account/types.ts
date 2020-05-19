export enum AccountActionTypes {
  setDid = 'setDid',
  resetAccount = 'resetAccount',
}

export interface AccountState {
  did: string
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
