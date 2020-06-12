export enum AccountActionTypes {
  setDid = 'setDid',
  setEntropy = 'setEntropy',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
}

export interface AccountState {
  did: string
  entropy: string
  loggedIn: boolean
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
