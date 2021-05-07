import { useToasts } from '~/hooks/toasts'
import { ToastBody } from '~/types/toasts'
import { strings } from '~/translations/strings'

const useInteractionToasts = () => {
  const { scheduleInfo } = useToasts()

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) =>
    scheduleInfo({
      title: strings.INTERACTION_SUCCESS_TOAST_TITLE,
      message: strings.INTERACTION_SUCCESS_TOAST_MSG,
      ...config,
    })

  return {
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
