import {
  CLEAR_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  SCHEDULE_NOTIFICATION,
} from '../../reducers/notifications'
import { randomBytes } from 'crypto'
import {
  Notification,
  NotificationMessage,
  NotificationScope,
  NotificationSeverity,
  NotificationType,
} from '../../reducers/notifications/types'

export const removeNotification = (notification: Notification) => ({
  type: REMOVE_NOTIFICATION,
  value: notification,
})

export const scheduleNotification = (notification: Notification) => ({
  type: SCHEDULE_NOTIFICATION,
  value: notification,
})

export const clearAllNotifications = () => ({
  type: CLEAR_NOTIFICATIONS,
})

export const infoNotification = (
  message: NotificationMessage,
): Notification => ({
  uid: randomBytes(4).toString('hex'), // TODO abstract
  type: NotificationType.info,
  message,
  severity: NotificationSeverity.medium,
  scope: NotificationScope.global,
  dismissible: true,
  autoDismissMs: 3000,
  handleConfirm: removeNotification,
  handleDismiss: removeNotification,
})
