import { Locales } from '~/translations'

export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  setLocalAuth = 'setLocalAuth',
  resetAccount = 'resetAccount',
  showTermsConsent = 'showTermsConsent',
  setAppLocked = 'setAppLocked',
  setScreenHeight = 'setScreenHeight',
  setCurrentLanguage = 'setCurrentLanguage',
  setAppDisabled = 'setAppDisabled',
  setMnemonicWarningVisibility = 'setMnemonicWarningVisibility',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isLocalAuthSet: boolean
  isAppLocked: boolean
  showTermsConsent: boolean
  screenHeight: number
  currentLanguage: Locales
  isAppDisabled: boolean
  isMnemonicWarningVisible: boolean | undefined
}
