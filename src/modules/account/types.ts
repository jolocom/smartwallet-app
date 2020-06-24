export enum AccountActionTypes {
  setDid = 'setDid',
  setEntropy = 'setEntropy',
  setLogged = 'setLogged',
  resetAccount = 'resetAccount',
  lockApp = 'lockApp',
  unlockApp = 'unlockApp',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
  setInteraction = 'setInteraction',
  resetInteraction = 'resetInteraction',
}

export interface AccountState {
  did: string
  entropy: string
  loggedIn: boolean
  isAppLocked: boolean
  isLocalAuthSet: boolean
  interactionId: string
}

export interface Action {
  type: AccountActionTypes
  payload?: any
}
