import createAction from '~/utils/createAction'
import { ToastsActions } from './types'
import { Toast, ToastFilter } from '~/types/toasts'
import { ThunkAction, RootReducerI } from '~/types/reducer'
import { toastMatchesFilter } from './utils'

const addToQueue = createAction(ToastsActions.addToQueue)
const removeFromQueue = createAction(ToastsActions.removeFromQueue)
const setActiveToast = createAction(ToastsActions.setActiveToast)
const setActiveFilter = createAction(ToastsActions.setActiveFilter)

const clearActiveToast = setActiveToast({ toast: null, expiry: 0 })

export const scheduleToast = (toast: Toast): ThunkAction => (dispatch) => {
  dispatch(addToQueue(toast))
  return dispatch(updateToastState)
}

export const removeToastAndUpdate = (
  toast: Toast,
  clearActive = true,
): ThunkAction => (dispatch, getState) => {
  dispatch(removeFromQueue(toast))

  if (clearActive) {
    const { active } = getState().toasts
    if (active && active.id === toast.id) {
      dispatch(clearActiveToast)
    }
  }

  return dispatch(updateToastState)
}

export const setActiveFilterAndUpdate = (filter: ToastFilter): ThunkAction => (
  dispatch,
) => {
  dispatch(setActiveFilter(filter))
  return dispatch(updateToastState)
}

let nextUpdateTimeout: NodeJS.Timeout | null = null
let updateInProgress = false

const getActiveToastState = (state: RootReducerI) => {
  const curTs = Date.now()
  const { active, activeExpiryTs } = state.toasts
  const isActiveExpired =
    !active || (active.dismiss && activeExpiryTs && curTs >= activeExpiryTs)
  const isActiveSticky = active && !active.dismiss
  return { active, isActiveExpired, curTs, isActiveSticky }
}

const updateToastState: ThunkAction = async (dispatch, getState) => {
  if (updateInProgress) return
  updateInProgress = true

  let next = null,
    nextExpiry,
    ret

  let { isActiveExpired, isActiveSticky, active, curTs } = getActiveToastState(
    getState(),
  )

  // un-queue the active toast if it is expired
  if (active && isActiveExpired) {
    dispatch(removeToastAndUpdate(active, false))
  }

  // clear the active toast if it should be filtered
  if (active && !isActiveExpired) {
    const { activeFilter } = getState().toasts

    if (!toastMatchesFilter(activeFilter, active)) {
      ret = dispatch(clearActiveToast)
      ;({
        isActiveExpired,
        isActiveSticky,
        active,
        curTs,
      } = getActiveToastState(getState()))

      if (nextUpdateTimeout) {
        clearTimeout(nextUpdateTimeout)
        nextUpdateTimeout = null
      }
    }
  }

  // we only attempt to find a next toast if the active one is
  // expired or sticky (non-dismissible)
  if (isActiveExpired || isActiveSticky) {
    const { queue: fullQueue, activeFilter } = getState().toasts
    const queue = fullQueue.filter(toastMatchesFilter.bind(null, activeFilter))
    if (queue.length) {
      // find the next dismissible toast, or otherwise take the first in
      // queue. Note that this means we do not support showing two non-dismissible
      // toasts
      next = queue.find((toast) => !!toast.dismiss) || queue[0]
    } else if (active) {
      // NOTE: active toast is cleared twice if it's a sticky and the queue is empty
      ret = dispatch(clearActiveToast)
    }
  } else if (active) {
    // active toast should not be changed
    next = active
  }

  // if there's a next and it is not the already active toast
  if (next && next !== active) {
    // if next should be automatically dismissed, setup a timeout for it
    if (next.dismiss && next.dismiss.timeout) {
      if (nextUpdateTimeout) {
        // this should normally never be the case.... but
        clearTimeout(nextUpdateTimeout)
      }
      nextUpdateTimeout = setTimeout(() => {
        nextUpdateTimeout = null
        dispatch(updateToastState)
        // +5 for good taste
      }, next.dismiss.timeout + 5)

      nextExpiry = curTs + next.dismiss.timeout
    }
    ret = dispatch(setActiveToast({ toast: next, expiry: nextExpiry }))
  }

  updateInProgress = false
  return ret
}
