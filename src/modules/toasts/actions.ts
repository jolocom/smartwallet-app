import createAction from '~/utils/createAction'
import { ToastsAction, ToastsActions, ToastsActionType } from './types'
import { Toast, ToastFilter } from '~/types/toasts'
import { ThunkAction, RootReducerI } from '~/types/reducer'
import { toastMatchesFilter } from './utils'
import { useToast } from '~/hooks/toasts'

// To avoid manually passing a generic type every time we call `createAction`
// redeclaring createAction fn with types specific to the `toasts` module
function createToastsAction<K extends keyof ToastsActions>(type: K) {
  return createAction<ToastsAction<K>>(type)
}

export const addToQueue = createToastsAction(ToastsActionType.addToQueue)
export const removeFromQueue = createToastsAction(
  ToastsActionType.removeFromQueue,
)
export const setActiveToast = createToastsAction(
  ToastsActionType.setActiveToast,
)
export const setActiveFilter = createToastsAction(
  ToastsActionType.setActiveFilter,
)

export const clearActiveToast = setActiveToast({ toast: null, expiry: 0 })

export const scheduleToast =
  (toast: Toast): ThunkAction =>
  (dispatch) => {
    dispatch(addToQueue(toast))
    return dispatch(updateToastState)
  }

export const removeToastAndUpdate =
  (toast: Toast, clearActive = true): ThunkAction =>
  (dispatch, getState) => {
    dispatch(removeFromQueue(toast))

    if (clearActive) {
      const { active } = getState().toasts
      if (active && active.id === toast.id) {
        dispatch(clearActiveToast)
      }
    }

    return dispatch(updateToastState)
  }

export const setActiveFilterAndUpdate =
  (filter: ToastFilter): ThunkAction =>
  (dispatch) => {
    dispatch(setActiveFilter(filter))
    return dispatch(updateToastState)
  }

const updateToastState = (() => {
  let nextUpdateTimeout: number | null = null
  let updateInProgress = false

  let activeState: {
    active: null | Toast
    isActiveExpired: boolean
    isActiveSticky: boolean
    curTs: number
  } = {
    active: null,
    isActiveExpired: false,
    isActiveSticky: false,
    curTs: Date.now(),
  }

  const updateState = (state: RootReducerI) => {
    const curTs = Date.now()
    const { active, activeExpiryTs } = state.toasts
    const isActiveExpired =
      !active || !!(active.dismiss && activeExpiryTs && curTs >= activeExpiryTs)
    const isActiveSticky = !!active && !active.dismiss
    activeState = { active, isActiveExpired, curTs, isActiveSticky }
  }

  // ThunkActions must always return an AnyAction, unless they are async
  // This is async just so it can some times return nothing (when there is another
  // update already running, as a side-effect of some change), to avoid recursion.
  const update: ThunkAction = async (dispatch, getState) => {
    if (updateInProgress) return
    updateInProgress = true

    let next = null,
      nextExpiry = 0,
      ret

    updateState(getState())

    // un-queue the active toast if it is expired
    if (activeState.active && activeState.isActiveExpired) {
      dispatch(removeToastAndUpdate(activeState.active, false))
    }

    // clear the active toast if it should be filtered
    if (activeState.active && !activeState.isActiveExpired) {
      const { activeFilter } = getState().toasts

      if (!toastMatchesFilter(activeFilter, activeState.active)) {
        ret = dispatch(clearActiveToast)
        // NOTE: Re-assigning the updated toast state after clearing the
        // active toast
        updateState(getState())

        if (nextUpdateTimeout) {
          clearTimeout(nextUpdateTimeout)
          nextUpdateTimeout = null
        }
      }
    }

    // we only attempt to find a next toast if the active one is
    // expired or sticky (non-dismissible)
    if (activeState.isActiveExpired || activeState.isActiveSticky) {
      const { queue: fullQueue, activeFilter } = getState().toasts
      const queue = fullQueue.filter(
        toastMatchesFilter.bind(null, activeFilter),
      )
      if (queue.length) {
        // find the next dismissible toast, or otherwise take the first in
        // queue. Note that this means we do not support showing two non-dismissible
        // toasts
        next = queue.find((toast) => !!toast.dismiss) || queue[0]
      } else if (activeState.active) {
        // NOTE: active toast is cleared twice if it's a sticky and the queue is empty
        ret = dispatch(clearActiveToast)
      }
    } else if (activeState.active) {
      // active toast should not be changed
      next = activeState.active
    }

    // if there's a next and it is not the already active toast
    if (next && next !== activeState.active) {
      // if next should be automatically dismissed, setup a timeout for it
      if (next.dismiss) {
        if (nextUpdateTimeout) {
          // this should normally never be the case.... but
          clearTimeout(nextUpdateTimeout)
        }
        nextUpdateTimeout = setTimeout(() => {
          nextUpdateTimeout = null
          dispatch(update)
          // +5 for good taste
        }, next.dismiss + 5)

        nextExpiry = activeState.curTs + next.dismiss
      }
      ret = dispatch(setActiveToast({ toast: next, expiry: nextExpiry }))
    }

    updateInProgress = false
    return ret
  }

  return update
})()
