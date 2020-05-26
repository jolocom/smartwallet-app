export enum AccountActionTypes {
  setDid = 'setDid',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
}

export interface AccountState {
  did: string
  loggedIn: boolean
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
