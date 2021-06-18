import { RootReducerI } from '~/types/reducer'

export const getDid = (state: RootReducerI): string => state.account.did
export const isLogged = (state: RootReducerI): boolean => state.account.loggedIn
export const isLocalAuthSet = (state: RootReducerI): boolean =>
  state.account.isLocalAuthSet
export const shouldShowTermsConsent = (state: RootReducerI) =>
  state.account.showTermsConsent
export const getIsAppLocked = (state: RootReducerI) => state.account.isAppLocked
export const getScreenHeight = (state: RootReducerI) =>
  state.account.screenHeight
