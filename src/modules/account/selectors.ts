import { RootReducerI } from '~/types/reducer'
import { createSelector } from 'reselect'

export const getDid = (state: RootReducerI): string => state.account.did
export const isLogged = createSelector(getDid, (did) => !!did.length)
