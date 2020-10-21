export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isLocalAuthSet: boolean
}
