export enum AccountActionTypes {
  setDid = 'setDid',
  setEntropy = 'setEntropy',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
}

export interface AccountState {
  did: string
  entropy: string
  loggedIn: boolean
  isAppLocked: boolean
  isLocalAuthSet: boolean
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
