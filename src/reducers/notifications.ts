import { AnyAction } from 'redux'
import { reject } from 'ramda'

export const SCHEDULE_NOTIFICATION = 'SCHEDULE_NOTIFICATION'
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION'
export const CLEAR_NOTIFICATIONS = 'CLEAR_NOTIFICATIONS'

export enum NotificationTypes {
  error, // Errors, i.e. rendered full screen or in top banner with CTA
  info, // Info, i.e. credential saved correctly. Rendered in top banner with CTA
  success, // TODO Needed? How is this different from info?
  warning, // TODO Needed? How is this different from info?
}

export enum NotificationSeverity {
  low, // Perhaps handled in components? I.e. skipped by the top level notifications handler
  medium, // Normal
  high, // FULL Screen for errors, colored action buttons for other notifications
}

export interface NotificationMessage {
  title: string
  message: string
}

export interface Notification {
  uid: string
  type: NotificationTypes
  severity: NotificationSeverity
  dismissible: boolean
  autoDismissMs?: number // TODO Component
  onClose: (notification: Notification) => AnyAction
  onConfirm: (notification: Notification) => AnyAction
}

export interface InfoNotification extends Notification {
  message: NotificationMessage
}

export type NotificationsState = Notification[]
const initialState: NotificationsState = []

export const notificationsReducer = (
  state = initialState,
  action: AnyAction,
): NotificationsState => {
  switch (action.type) {
    case SCHEDULE_NOTIFICATION:
      console.log(state)
      return [...state, action.value]
    case REMOVE_NOTIFICATION:
      return reject(
        notification => notification.uid === action.value.uid,
        state,
      )
    case CLEAR_NOTIFICATIONS:
      return initialState
    default:
      return state
  }
}
