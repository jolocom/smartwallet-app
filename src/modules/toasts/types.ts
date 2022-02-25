import { Toast, ToastFilter } from '~/types/toasts'

export enum ToastsActionType {
  addToQueue = 'addToQueue',
  removeFromQueue = 'removeFromQueue',
  setActiveToast = 'setActiveToast',
  // TODO: not used
  setActiveFilter = 'setActiveFilter',
}

// Expressing dependency between action type and action payload;
// key: action type, value: action payload
export interface ToastsActions {
  [ToastsActionType.addToQueue]: Toast
  // TODO: id is enough to remove a toast
  [ToastsActionType.removeFromQueue]: Toast
  [ToastsActionType.setActiveToast]: {
    toast: Toast | null
    expiry: number
  }
  [ToastsActionType.setActiveFilter]: ToastFilter
}

// Dependency between action type and its payload following Action type signature
export type ToastsAction<A extends keyof ToastsActions> = {
  type: A
  payload: ToastsActions[A]
}

export interface ToastsState {
  queue: Toast[]
  active: Toast | null
  activeExpiryTs: number
  activeFilter: ToastFilter
}
