import { AnyAction } from 'redux'
import { Notification } from '../../reducers/notifications/types'

export type NotificationHandler = (notification: Notification) => AnyAction

export interface NotificationConsumer {
  notification: Notification
  handleDismiss: NotificationHandler
  handleConfirm: NotificationHandler
}
