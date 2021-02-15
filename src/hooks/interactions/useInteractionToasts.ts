import { useToasts } from '~/hooks/toasts'
import { ToastBody } from '~/types/toasts'
import { strings } from '~/translations/strings'
import { ScreenNames } from '~/types/screens'
import { useRedirect } from '../navigation'

const useInteractionToasts = () => {
  const { scheduleInfo, scheduleWarning } = useToasts()
  const redirect = useRedirect()

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) =>
    scheduleInfo({
      title: strings.INTERACTION_SUCCESS_TOAST_TITLE,
      message: strings.INTERACTION_SUCCESS_TOAST_MSG,
      ...config,
    })

  const scheduleErrorInteraction = (config?: Partial<ToastBody>) =>
    scheduleWarning({
      title: strings.ERROR_TOAST_TITLE,
      message: strings.ERROR_TOAST_MSG,
      interact: {
        label: strings.REPORT,
        onInteract: () => {
          //TODO: should be the Error Reporting screen. Using ContactUs as a placeholder
          redirect(ScreenNames.ContactUs)
        },
      },
      ...config,
    })

  return {
    scheduleErrorInteraction,
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
