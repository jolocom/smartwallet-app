import { ThunkAction } from 'src/store'
import { Notification } from 'src/lib/notifications'
import {
  SET_ACTIVE_NOTIFICATION,
  SCHEDULE_NOTIFICATION,
  REMOVE_NOTIFICATION,
  CLEAR_NOTIFICATIONS,
} from 'src/reducers/notifications'


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

export const invokeInteract = (
  notif: Notification,
): ThunkAction => async dispatch => {
  let keepNotification = false
  const { interact } = notif
  if (interact && interact.onInteract) {
    keepNotification = (await interact.onInteract()) === true
  }
  if (!keepNotification) return dispatch(removeNotification(notif))
}

export const invokeDismiss = (
  notif: Notification,
): ThunkAction => async dispatch => {
  const { dismiss } = notif
  if (typeof dismiss === 'object' && dismiss.onDismiss) {
    await dismiss.onDismiss()
  }
  return dispatch(removeNotification(notif))
}

export const clearAllNotifications = (): ThunkAction => dispatch => {
  dispatch({ type: CLEAR_NOTIFICATIONS })
  return dispatch(updateNotificationsState)
}

/**
 * NOTE
 * These are internal to the notifications action system on purpose
 * to reduce complexity on consumer side. They should not be exported.
 *
 * In a perfect case scenario, we should never need to manually call for an
 * update action.
 */

let nextUpdateTimeout: number | null = null
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
  const isActiveExpired =
    !active || (active.dismiss && activeExpiryTs && curTs >= activeExpiryTs)
  const isActiveSticky = active && !active.dismiss

  let next = null, nextExpiry

  // unqueue the active notification if it is expired
  if (active && isActiveExpired) dispatch(removeNotification(active))

  // we only attempt to find a next notification if the active one is
  // expired or sticky (non-dismissible)
  if (isActiveExpired || isActiveSticky) {
    const { queue } = getState().notifications
    if (queue.length) {
      // find the next dissmissible notification, or otherwise take the first in
      // queue. Note that this means we do not support showing two non-dismissible
      // notifications
      next = queue.find(notification => !!notification.dismiss) || queue[0]
    }
  } else if (active) {
    // active notification should not be changed
    next = active
  }

  // if there's a next and it is not the already active notification
  if (next && next != active) {
    // if next should be automatically dismissed, setup a timeout for it
    if (next.dismiss && next.dismiss.timeout) {
      if (nextUpdateTimeout) {
        // this should normally never be the case.... but
        clearTimeout(nextUpdateTimeout)
      }
      nextUpdateTimeout = setTimeout(() => {
        nextUpdateTimeout = null
        dispatch(updateNotificationsState)
        // +5 for good taste
      }, next.dismiss.timeout + 5)

      nextExpiry = curTs + next.dismiss.timeout
    }
    ret = dispatch(setActiveNotification(next, nextExpiry))
  }

  updateInProgress = false
  return ret
}
