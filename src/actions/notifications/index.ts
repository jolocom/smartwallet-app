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
  NotificationType,
} from 'src/reducers/notifications/types'

export const setActiveNotification = (
  notification: Notification | null,
  expiry?: number,
) => ({
  type: SET_ACTIVE_NOTIFICATION,
  notification,
  expiry,
})

export const scheduleNotification = (
  notification: Notification,
): ThunkAction => dispatch => {
  dispatch({
    type: SCHEDULE_NOTIFICATION,
    notification,
  })
  return dispatch(updateNotificationsState)
}

export const removeNotification = (
  notification: Notification,
): ThunkAction => dispatch => {
  dispatch({
    type: REMOVE_NOTIFICATION,
    notification,
  })
  return dispatch(updateNotificationsState)
}

export const clearAllNotifications = (): ThunkAction => dispatch => {
  dispatch({ type: CLEAR_NOTIFICATIONS })
  return dispatch(updateNotificationsState)
}

export const infoNotification = (info: NotificationMessage): Notification => ({
  id: randomBytes(4).toString('hex'), // TODO abstract
  type: NotificationType.info,
  title: info.title,
  message: info.message,
  dismissible: true,
  autoDismissMs: 3000,
  handleConfirm: removeNotification,
  handleDismiss: removeNotification,
})

/**
 * NOTE
 * These are internal to the notifications action system on purpose
 * to reduce complexity on consumer side. They should not be exported.
 *
 * In a perfect case scenario, we should never need to manually call for an
 * update action.
 */

let nextUpdateTimeout: ReturnType<typeof setTimeout> | null = null
let updateInProgress = false
// ThunkActions must always return an AnyAction, unless they are async
// This is async just so it can some times return nothing (when there is another
// update already running, as a side-effect of some change), to avoid recursion.
const updateNotificationsState: ThunkAction = async (dispatch, getState) => {
  if (updateInProgress) return
  updateInProgress = true
  let ret

  const curTs = Date.now()
  const { active, activeExpiryTs } = getState().notifications
  const isActiveExpired = !active || (active.dismissible && activeExpiryTs && (curTs >= activeExpiryTs))
  const isActiveSticky = active && !active.dismissible

  let next = null, nextExpiry

  // unqueue the active notification if it is expired
  if (isActiveExpired && active) dispatch(removeNotification(active))

  // we only attempt to find a next notification if the active one is
  // expired or sticky (non-dismissible)
  if (isActiveExpired || isActiveSticky) {
    const { queue } = getState().notifications
    if (queue.length) {
      // find the next dissmissible notification, or otherwise take the first in
      // queue. Note that this means we do not support showing two non-dismissible
      // notifications
      const idx = queue.findIndex(notification => notification.dismissible)
      next = queue[idx > -1 ? idx : 0]
    }
  } else if (active) {
    // active notification should not be changed
    next = active
  }

  // if there's a next and it is not the already active notification
  if (next && next != active) {
    // if next should be automatically dismissed, setup a timeout for it
    if (next.dismissible && next.autoDismissMs) {
      if (nextUpdateTimeout) {
        // this should normally never be the case.... but
        clearTimeout(nextUpdateTimeout)
      }
      nextUpdateTimeout = setTimeout(() => {
        nextUpdateTimeout = null
        dispatch(updateNotificationsState)
        // +5 for good taste
      }, next.autoDismissMs + 5)

      nextExpiry = curTs + next.autoDismissMs
    }
    ret = dispatch(setActiveNotification(next, nextExpiry))
  }

  updateInProgress = false
  return ret
}
