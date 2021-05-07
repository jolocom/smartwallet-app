import { useToasts } from '~/hooks/toasts'
import { ToastBody } from '~/types/toasts'
import { strings } from '~/translations/strings'
import useErrors from '../useErrors'
import { useGoBack } from '../navigation'

const useInteractionToasts = () => {
  const { scheduleInfo, scheduleWarning } = useToasts()
  const goBack = useGoBack()
  const { showErrorReporting } = useErrors()

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) =>
    scheduleInfo({
      title: strings.INTERACTION_SUCCESS_TOAST_TITLE,
      message: strings.INTERACTION_SUCCESS_TOAST_MSG,
      ...config,
    })

  const scheduleErrorInteraction = (
    error: Error,
    config?: Partial<ToastBody>,
  ) => {
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
  }
  return {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
