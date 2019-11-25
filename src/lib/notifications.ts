import { AppError } from 'src/lib/errors'
import { randomBytes } from 'crypto'

interface NotificationMessage {
  title: string
  message?: string
}

/**
 * A notification is either dismissible or not
 * if it is dismissible it can also optionally have
 * - a label (for the dismiss button)
 * - a timeout (to auto-dismiss)
 * - a callback
 */

type NotificationDismiss = {
  dismiss?: boolean | {
    label?: string,
    timeout?: number,
    onDismiss?: (...args: any) => void
  },
}

/**
 * A notification may have a call to action button,
 * with a label and an onInteract callback
 */
type NotificationInteract = {
  interact?: {
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

interface NotificationBase {
  id: string
  type: NotificationType
}

type PartialNotification = Partial<NotificationBase> &
  NotificationInteract &
  NotificationDismiss

const createNotificationFactory = (
  template: PartialNotification & Omit<NotificationBase, 'id'>,
) => (overrides: PartialNotification & NotificationMessage): Notification =>
  ({
    id: randomBytes(4).toString('hex'), // TODO abstract
    ...(template as Notification),
    ...overrides,
  } as Notification)

export type Notification = NotificationBase &
  NotificationInteract &
  NotificationDismiss &
  NotificationPayload

export enum NotificationType {
  error = 'error',
  info = 'info',
  warning = 'warning',
}

export const createInfoNotification = createNotificationFactory({
  type: NotificationType.info,
  dismiss: {
    timeout: 3000,
  },
})

export const createStickyNotification = createNotificationFactory({
  type: NotificationType.info,
  dismiss: false,
})
