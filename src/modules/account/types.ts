import { Locales } from '~/translations'

export enum AccountActions {
  setDid = 'setDid',
  setLogged = 'setLogged',
  setLocalAuth = 'setLocalAuth',
  resetAccount = 'resetAccount',
  setAppLocked = 'setAppLocked',
  setScreenHeight = 'setScreenHeight',
  setCurrentLanguage = 'setCurrentLanguage',
  setAppDisabled = 'setAppDisabled',
  setMnemonicWarningVisibility = 'setMnemonicWarningVisibility',
  setTermsConsentVisibility = 'setTermsConsentVisibility',
  setTermsConsentOutdatedness = 'setTermsConsentOutdatedness',
}

export interface AccountState {
  did: string
  loggedIn: boolean
  isLocalAuthSet: boolean
  isAppLocked: boolean
  screenHeight: number
  currentLanguage: Locales
  isAppDisabled: boolean
  isMnemonicWarningVisible: boolean | undefined
  isTermsConsentVisible: boolean
  isTermsConsentOutdated: boolean
}
