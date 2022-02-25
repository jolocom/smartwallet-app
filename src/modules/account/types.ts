import { Locales } from '~/translations'

export enum AccountActionType {
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
  setMakingScreenshotDisability = 'setMakingScreenshotDisability',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface AccountActions {
  [AccountActionType.setDid]: string
  [AccountActionType.setLogged]: boolean
  [AccountActionType.setLocalAuth]: boolean
  [AccountActionType.resetAccount]: undefined
  [AccountActionType.setAppLocked]: boolean
  [AccountActionType.setScreenHeight]: number
  [AccountActionType.setCurrentLanguage]: Locales
  [AccountActionType.setAppDisabled]: boolean
  [AccountActionType.setMnemonicWarningVisibility]: boolean
  [AccountActionType.setTermsConsentVisibility]: boolean
  [AccountActionType.setTermsConsentOutdatedness]: boolean
  [AccountActionType.setMakingScreenshotDisability]: boolean
}

// Dependency between action type and its payload following Action type signature
export type AccountAction<A extends keyof AccountActions> = {
  type: A
  payload: AccountActions[A]
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
  termsConsent: {
    isVisible: boolean
    isOutdated: boolean
  }
  isMakingScreenshotDisabled: boolean
}
