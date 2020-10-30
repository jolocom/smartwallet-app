import { useSelector, useDispatch } from 'react-redux'

import { getActiveToast } from '~/modules/toasts/selectors'
import {
  Toast,
  createInfoToast,
  createWarningToast,
  createStickyToast,
  ToastBody,
} from '~/types/toasts'
import { scheduleToast } from '~/modules/toasts/actions'

export const useToasts = () => {
  const dispatch = useDispatch()
  const activeToast = useSelector(getActiveToast)

  const scheduleInfo = (toast: ToastBody) => {
    dispatch(scheduleToast(createInfoToast(toast)))
  }

  const scheduleWarning = (toast: ToastBody) => {
    dispatch(scheduleToast(createWarningToast(toast)))
  }

  const scheduleSticky = (toast: ToastBody) => {
    dispatch(scheduleToast(createStickyToast(toast)))
  }

  const removeToast = (toast: Toast) => {
    dispatch(removeToast(toast))
  }

  const invokeInteract = () => {
    if (!activeToast) {
      throw new Error('No toast to invoke!')
    }

    let keepToast = false
    const { interact } = activeToast
    if (interact && interact.onInteract) {
      keepToast = interact.onInteract() === true
    }

    !keepToast && removeToast(activeToast)
  }

  const invokeDismiss = () => {
    if (!activeToast) {
      throw new Error('No toast to invoke!')
    }

    const { dismiss } = activeToast
    if (typeof dismiss === 'object' && dismiss.onDismiss) {
      dismiss.onDismiss()
    }

    return dispatch(removeToast(activeToast))
  }

  return {
    scheduleInfo,
    scheduleWarning,
    scheduleSticky,
    removeToast,
    invokeInteract,
    invokeDismiss,
    activeToast,
  }
}
