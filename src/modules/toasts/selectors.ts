import { RootReducerI } from '~/types/reducer'

export const getActiveToast = (state: RootReducerI) => state.toasts.active
export const getToastQueue = (state: RootReducerI) => state.toasts.queue
export const getToastFilter = (state: RootReducerI) => state.toasts.activeFilter
export const getActiveExpiry = (state: RootReducerI) =>
  state.toasts.activeExpiryTs
