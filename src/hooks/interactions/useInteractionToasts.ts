import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { useToasts } from '~/hooks/toasts'
import { getRedirectUrl } from '~/modules/interaction/selectors'
import { ToastBody } from '~/types/toasts'
import useTranslation from '../useTranslation'

const useInteractionToasts = () => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const redirectUrl = useSelector(getRedirectUrl)

  const scheduleSuccessInteraction = (config?: Partial<ToastBody>) => {
    // NOTE: The `_` symbol is a placeholder for a missing redirectUrl, since
    // `Linking.canOpenURL` doesn't accept empty strings
    Linking.canOpenURL(redirectUrl ?? '_')
      .then((canOpen) => {
        if (canOpen && redirectUrl) {
          scheduleInfo({
            title: t('Toasts.interactionSuccessRedirectTitle'),
            message: t('Toasts.interactionSuccessRedirectMsg'),
            interact: {
              label: t('Toasts.interactionSuccessRedirectBtn'),
              onInteract: () => {
                Linking.openURL(redirectUrl).catch(scheduleErrorWarning)
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
      })
      .catch(scheduleErrorWarning)
  }

  return {
    scheduleSuccessInteraction,
  }
}

export default useInteractionToasts
