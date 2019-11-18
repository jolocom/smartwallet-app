import { randomBytes } from 'crypto'
import { ThunkAction } from 'src/store'
import {
  CLEAR_NOTIFICATIONS,
  REMOVE_NOTIFICATION,
  SET_ACTIVE_NOTIFICATION,
  SCHEDULE_NOTIFICATION,
} from 'src/reducers/notifications'
import {
  Notification,
  NotificationMessage,
  NotificationSeverity,
  NotificationType,
} from 'src/reducers/notifications/types'

export const removeNotification = (notification: Notification) => ({
  type: REMOVE_NOTIFICATION,
  value: notification,
})

export const setActiveNotification = (
  notification?: Notification | null,
  expiry?: number,
) => ({
  type: SET_ACTIVE_NOTIFICATION,
  notification,
  expiry,
})

export const clearActiveNotification: ThunkAction = (dispatch, getState) => {
  const { active } = getState().notifications
  if (active) dispatch(removeNotification(active))
  dispatch({
    type: SET_ACTIVE_NOTIFICATION,
    notification: null,
  })
  return dispatch(updateNotificationsState)
}

export const scheduleNotification = (
  notification: Notification,
): ThunkAction => dispatch => {
  dispatch({
    type: SCHEDULE_NOTIFICATION,
    value: notification,
  })
  return dispatch(updateNotificationsState)
}

export const clearAllNotifications = (): ThunkAction => dispatch => {
  dispatch({ type: CLEAR_NOTIFICATIONS })
  return dispatch(updateNotificationsState)
}

export const infoNotification = (info: NotificationMessage): Notification => ({
  uid: randomBytes(4).toString('hex'), // TODO abstract
  type: NotificationType.info,
  title: info.title,
  message: info.message,
  severity: NotificationSeverity.medium,
  dismissible: true,
  autoDismissMs: 3000,
  handleConfirm: removeNotification,
  handleDismiss: removeNotification,
})

// NOTE: these are internal to the notifications action system on purpose
// they should not be exported
let nextUpdateTimeout: ReturnType<typeof setTimeout> | null = null
const updateNotificationsState: ThunkAction = (dispatch, getState) => {
  const curTs = Date.now()
  const { queue, active, activeExpiry } = getState().notifications
  const isActiveExpired = !active || (active.dismissible && activeExpiry && (curTs >= activeExpiry))
  const isActiveSticky = active && !active.dismissible

  let next, expiry

  // we only attempt to find a next notification if the active one is
  // expired or sticky (non-dismissible)
  if ((isActiveExpired || isActiveSticky) && queue.length) {
    // unqueue the active notification if it is expired
    if (active) dispatch(removeNotification(active))

    // find the next dissmissible notification, or otherwise take the first in
    // queue. Note that this means we do not support showing two non-dismissible
    // notifications
    const idx = queue.findIndex(notification => notification.dismissible)
    next = queue[idx > -1 ? idx : 0]
  }

  if (next && next.dismissible && next.autoDismissMs) {
    if (nextUpdateTimeout) {
      // this should normally never be the case.... but
      clearTimeout(nextUpdateTimeout)
    }

    nextUpdateTimeout = setTimeout(() => {
      nextUpdateTimeout = null
      dispatch(updateNotificationsState)
      // +5 for good taste
    }, next.autoDismissMs + 5)

    expiry = curTs + next.autoDismissMs
  }

  return dispatch(setActiveNotification(next, expiry))
}
