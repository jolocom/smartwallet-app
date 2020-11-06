import { Toast, ToastFilter } from '~/types/toasts'

export enum ToastsActions {
  addToQueue = 'addToQueue',
  removeFromQueue = 'removeFromQueue',
  setActiveToast = 'setActiveToast',
  clearToasts = 'clearToasts',
  setActiveFilter = 'setActiveFilter',
}

export interface ToastsState {
  queue: Toast[]
  active: Toast | null
  activeExpiryTs: number
  activeFilter: ToastFilter
}
