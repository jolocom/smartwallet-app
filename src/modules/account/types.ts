export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  setLocalAuth = 'setLocalAuth',
  accountReset = 'accountReset',
  showTermsConsent = 'showTermsConsent',
  setAppLocked = 'setAppLocked',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isLocalAuthSet: boolean
  isAppLocked: boolean
  showTermsConsent: boolean
}
