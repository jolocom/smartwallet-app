import { RootReducerI } from '~/types/reducer'

export const getDid = (state: RootReducerI): string => state.account.did
export const isLogged = (state: RootReducerI): boolean => state.account.loggedIn
export const isAppLocked = (state: RootReducerI): boolean =>
  state.account.isAppLocked
export const isLocalAuthSet = (state: RootReducerI): boolean =>
  state.account.isLocalAuthSet
