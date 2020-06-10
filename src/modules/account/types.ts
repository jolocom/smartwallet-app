export enum AccountActionTypes {
  setDid = 'setDid',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isAppLocked: boolean
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
