export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  setLocalAuth = 'setLocalAuth',
  resetAccount = 'resetAccount',
  showTermsConsent = 'showTermsConsent',
  setAppLocked = 'setAppLocked',
  setScreenHeight = 'setScreenHeight',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isLocalAuthSet: boolean
  isAppLocked: boolean
  showTermsConsent: boolean
  screenHeight: number
}
