import { Notification, NotificationFilter } from '~/types/toasts'

export enum ToastsActions {
  scheduleToast = 'scheduleToast',
  removeToast = 'removeToast',
  setActiveToast = 'setActiveToast',
  clearToasts = 'clearToasts',
  setActiveFilter = 'setActiveFilter',
}

export interface ToastsState {
  queue: Notification[]
  active: Notification | null
  activeExpiryTs: number
  activeFilter: NotificationFilter
}
