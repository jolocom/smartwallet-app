import { AppError } from '../../lib/errors'
import { NotificationHandler } from '../../ui/notifications/types'

export enum NotificationType {
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export interface NotificationMessage {
  title: string
  message?: string
}

/* A notification either is dismissible and has a delay specified, or isn't dismissible and
 * and therefore has no delay specified.
 * See https://stackoverflow.com/q/51412872
 */

type Dismissible =
  | {
      dismissible: true
      autoDismissMs: number
    }
  | {
      dismissible: false
      autoDismissMs?: never
    }

/* The payload is either a message if the type is warning or info, or an error if the type is error.
 * See https://stackoverflow.com/q/51412872
 */

type NotificationPayload =
  | {
      type: NotificationType.warning | NotificationType.info
      error?: never
    } & NotificationMessage
  | {
      type: NotificationType.error
      error: AppError
    }

interface BaseNotification {
  uid: string
  type: NotificationType
  severity: NotificationSeverity
}

/**
 * The Component rendering the notification, and implementing the {@link NotificationConsumer} interface
 * can call these methods when the user dismisses or taps on a notification
 * handleDismiss will default to {@link removeNotification}
 */

interface NotificationHandlers {
  handleDismiss: NotificationHandler
  handleConfirm: NotificationHandler
}

export type Notification = BaseNotification &
  Dismissible &
  NotificationHandlers &
  NotificationPayload
