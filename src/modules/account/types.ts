export enum AccountActionTypes {
  setDid = 'setDid',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
  setLocalAuth = 'setLocalAuth',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isAppLocked: boolean
  isLocaclAuthSet: boolean
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
