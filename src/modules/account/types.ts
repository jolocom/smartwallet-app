export enum AccountActions {
  setDid = 'setDid',
  setEntropy = 'setEntropy',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
}

export interface AccountState {
  did: string
  entropy: string
  loggedIn: boolean
  isLocalAuthSet: boolean
}
