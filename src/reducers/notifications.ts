import { AnyAction } from 'redux'

enum NotificationTypes {
  error, // Errors, i.e. rendered full screen or in top banner with CTA
  info, // Info, i.e. credential saved correctly. Rendered in top banner with CTA
  success, // TODO Needed? How is this different from info?
  warning, // TODO Needed? How is this different from info?
}

enum Severity {
  low, // Perhaps handled in components? I.e. skipped by the top level notifications handler
  medium, // Normal
  high, // FULL Screen for errors, colored action buttons for other notifications
}

interface Notification {
  uid: string // Needed?
  type: NotificationTypes
  severity: Severity
  dismissible: boolean
  autoDismissMs?: number // TODO Component
  onClose: Function
  onConfirm: Function
}

type NotificationsState = Notification[]
const initialState: NotificationsState = []

export const notificationsReducer = (
  state = initialState,
  action: AnyAction,
): NotificationsState => {
  switch (action.type) {
    case 'SCHEDULE_NOTIFICATION':
      return [...state, action.value]
    case 'CLEAR_NOTIFICATIONS':
      return initialState
    default:
      return state
  }
}
