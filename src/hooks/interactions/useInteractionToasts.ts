import { useToasts } from '~/hooks/toasts'
import { ToastBody } from '~/types/toasts'
import { strings } from '~/translations/strings'

const useInteractionToasts = () => {
  const { scheduleInfo, scheduleErrorWarning } = useToasts()

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
    scheduleErrorWarning(error, {
      title: strings.ERROR_TOAST_TITLE,
      message: strings.ERROR_TOAST_MSG,
      ...config,
    })
  }

  return {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
