import { useSelector, useDispatch } from 'react-redux'

import { getActiveToast } from '~/modules/toasts/selectors'
import {
  Toast,
  createInfoToast,
  createWarningToast,
  createStickyToast,
  ToastBody,
} from '~/types/toasts'
import { scheduleToast, removeToastAndUpdate } from '~/modules/toasts/actions'
import { strings } from '~/translations'
import useErrors from './useErrors'

export const useToasts = () => {
  const dispatch = useDispatch()
  const activeToast = useSelector(getActiveToast)
  const { showErrorReporting } = useErrors()

  const scheduleInfo = (toast: ToastBody) => {
    dispatch(scheduleToast(createInfoToast(toast)))
  }

  const scheduleWarning = (toast: ToastBody) => {
    dispatch(scheduleToast(createWarningToast(toast)))
  }

  const scheduleSticky = (toast: ToastBody) => {
    dispatch(scheduleToast(createStickyToast(toast)))
  }

  //TODO: don't pass title and message, but rather get them based on the SW error code
  const scheduleErrorWarning = (error: Error, config?: Partial<ToastBody>) =>
    scheduleWarning({
      title: strings.ERROR_TOAST_TITLE,
      message: strings.ERROR_TOAST_MSG,
      interact: {
        label: strings.REPORT,
        onInteract: () => {
          showErrorReporting(error)
        },
      },
      ...config,
    })

  const removeToast = (toast: Toast) => {
    dispatch(removeToastAndUpdate(toast))
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
    scheduleErrorWarning,
    removeToast,
    invokeInteract,
    invokeDismiss,
    activeToast,
  }
}
