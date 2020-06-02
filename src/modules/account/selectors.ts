import { RootReducerI } from '~/types/reducer'

export const getDid = (state: RootReducerI): string => state.account.did
export const isLogged = (state: RootReducerI): boolean => state.account.loggedIn
