import { AppError } from 'src/lib/errors'
import { randomBytes } from 'crypto'

interface NotificationMessage {
  title: string
  message?: string
}

/**
 * A notification is either dismissible, with an optional delay and onDismiss
 * callback, or isn't dismissible
 */

type NotificationDismissal =
  | {
      dismissible: true
      autoDismissMs?: number
      onDismiss?: (...args: any) => void
    }
  | {
      dismissible?: false
      autoDismissMs?: never
      onDismiss?: never
    }

/**
 * A notification may have a call to action button,
 * with a label and an onInteract callback
 */
type NotificationInteraction = {
  callToAction?: {
    label: string
    onInteract: (...args: any) => void | boolean | Promise<void | boolean>
  }
}

/**
 * The payload is either a message if the type is warning or info, or an error
 * if the type is error.
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
  id: string
  type: NotificationType
}

type PartialNotification = Partial<BaseNotification> &
  NotificationInteraction &
  NotificationDismissal

const createNotificationFactory = (
  template: PartialNotification & Omit<BaseNotification, 'id'>,
) => {
  return (
    overrides: PartialNotification & NotificationMessage,
  ): Notification => {
    const notif: Notification = {
      id: randomBytes(4).toString('hex'), // TODO abstract
      ...(template as Notification),
      ...overrides,
    } as Notification

    if (overrides.autoDismissMs) notif.dismissible = true

    return notif
  }
}

export type Notification = BaseNotification &
  NotificationInteraction &
  NotificationDismissal &
  NotificationPayload

export enum NotificationType {
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export const createInfoNotification = createNotificationFactory({
  type: NotificationType.info,
  dismissible: true,
  autoDismissMs: 3000,
})

export const createStickyNotification = createNotificationFactory({
  type: NotificationType.info,
  dismissible: false,
})
