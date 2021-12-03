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

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) => {
    if (redirectUrl) {
      // TODO: should the config overwrite the redirect toast?
      scheduleInfo({
        title: t('Toasts.successfulInteractionTitle'),
        message: 'You should return to back to the requester',
        interact: {
          label: 'Return',
          onInteract: () => {
            Linking.canOpenURL(redirectUrl).then((can) => {
              if (can) Linking.openURL(redirectUrl)
            })
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
