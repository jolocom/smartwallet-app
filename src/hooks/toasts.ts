import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { getActiveToast } from '~/modules/toasts/selectors'
import {
  Toast,
  createInfoToast,
  createWarningToast,
  createStickyToast,
  ToastBody,
  createSuccessToast,
} from '~/types/toasts'
import { scheduleToast, removeToastAndUpdate } from '~/modules/toasts/actions'
import useErrors from './useErrors'
import useTranslation from './useTranslation'

export const useToasts = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const activeToast = useSelector(getActiveToast)
  const { showErrorReporting } = useErrors()
  const [prevErrorWarning, setPrevErrorWarning] = useState<null | string>(null)

  const scheduleInfo = (toast: ToastBody) => {
    dispatch(scheduleToast(createInfoToast(toast)))
  }

  const scheduleSuccess = (toast: ToastBody) => {
    dispatch(scheduleToast(createSuccessToast(toast)))
  }

  const scheduleWarning = (toast: ToastBody) => {
    dispatch(scheduleToast(createWarningToast(toast)))
  }

  const scheduleSticky = (toast: ToastBody) => {
    dispatch(scheduleToast(createStickyToast(toast)))
  }

  const scheduleErrorInfo = (error: Error, config?: Partial<ToastBody>) => {
    console.warn(error)
    scheduleInfo({
      title: t('Toasts.errorWarningTitle'),
      message: t('Toasts.errorWarningMsg'),
      interact: {
        label: t('Toasts.reportBtn'),
        onInteract: () => {
          showErrorReporting(error)
        },
      },
      ...config,
    })
  }

  const scheduleErrorWarning = (error: Error, config?: Partial<ToastBody>) => {
    console.warn(error)
    if (prevErrorWarning === null || prevErrorWarning !== error.message) {
      setPrevErrorWarning(error.message)

      return scheduleWarning({
        title: t('Toasts.errorWarningTitle'),
        message: t('Toasts.errorWarningMsg'),
        interact: {
          label: t('Toasts.reportBtn'),
          onInteract: () => {
            showErrorReporting(error)
          },
        },
        ...config,
      })
    }

    return setPrevErrorWarning(error.message)
  }

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

  return {
    scheduleInfo,
    scheduleWarning,
    scheduleSticky,
    scheduleErrorWarning,
    scheduleErrorInfo,
    removeToast,
    invokeInteract,
    activeToast,
    scheduleSuccess,
  }
}
