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
      // TODO: should the config overwrite the redirect toast?
      scheduleInfo({
        title: t('Toasts.successfulInteractionTitle'),
        message: 'You should return back to the service',
        interact: {
          label: 'Return',
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
