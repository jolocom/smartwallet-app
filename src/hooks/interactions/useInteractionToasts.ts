import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { useToasts } from '~/hooks/toasts'
import { getRedirectUrl } from '~/modules/interaction/selectors'
import { ToastBody } from '~/types/toasts'
import useTranslation from '../useTranslation'

const useInteractionToasts = () => {
  const { t } = useTranslation()
  const { scheduleInfo } = useToasts()
  const redirectUrl = useSelector(getRedirectUrl)

  const scheduleSuccessInteraction = async (config?: Partial<ToastBody>) => {
    const shouldRedirect =
      !!redirectUrl && (await Linking.canOpenURL(redirectUrl))

    if (shouldRedirect) {
      scheduleInfo({
        title: t('Toasts.interactionSuccessRedirectTitle'),
        message: t('Toasts.interactionSuccessRedirectMsg'),
        interact: {
          label: t('Toasts.interactionSuccessRedirectBtn'),
          onInteract: () => {
            Linking.openURL(redirectUrl!)
          },
        },
      })
    } else {
      scheduleInfo({
        title: t('Toasts.successfulInteractionTitle'),
        message: t('Toasts.successfulInteractionMsg'),
        ...config,
      })
    }
  }

  return {
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
