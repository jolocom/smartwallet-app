export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isAppLocked: boolean
  isLocalAuthSet: boolean
}
