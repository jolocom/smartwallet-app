import { RootReducerI } from '~/types/reducer'

export const getDid = (state: RootReducerI): string => state.account.did
export const isLogged = (state: RootReducerI): boolean => state.account.loggedIn
export const isLocalAuthSet = (state: RootReducerI): boolean =>
  state.account.isLocalAuthSet
export const getIsTermsConsentVisible = (state: RootReducerI) =>
  state.account.isTermsConsentVisible
export const getIsTermsConsentOutdated = (state: RootReducerI) =>
  state.account.isTermsConsentOutdated
export const getIsAppLocked = (state: RootReducerI) => state.account.isAppLocked
export const getScreenHeight = (state: RootReducerI) =>
  state.account.screenHeight
export const getCurrentLanguage = (state: RootReducerI) =>
  state.account.currentLanguage
export const getIsAppDisabled = (state: RootReducerI) =>
  state.account.isAppDisabled
export const getMnemonicWarningVisibility = (state: RootReducerI) =>
  state.account.isMnemonicWarningVisible
