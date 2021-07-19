import { useToasts } from '~/hooks/toasts'
import { ToastBody } from '~/types/toasts'
import useTranslation from '../useTranslation'

const useInteractionToasts = () => {
  const { t } = useTranslation()
  const { scheduleInfo } = useToasts()

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) =>
    scheduleInfo({
      title: t('Toasts.successfulInteractionTitle'),
      message: t('Toasts.successfulInteractionMsg'),
      ...config,
    })

  return {
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
