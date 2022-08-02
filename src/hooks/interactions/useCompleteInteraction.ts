import { StackActions, useNavigation } from '@react-navigation/native'
import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { SWErrorCodes } from '~/errors/codes'
import { useToasts } from '~/hooks/toasts'
import {
  getDeeplinkConfig, getInteractionCounterparty
} from '~/modules/interaction/selectors'
import { ScreenNames } from '~/types/screens'
import { ToastBody } from '~/types/toasts'
import { getCounterpartyName } from '~/utils/dataMapping'
import useTranslation from '../useTranslation'
import { useFinishInteraction } from './handlers'

interface Config {
  toastConfig?: Partial<ToastBody>
  screenToNavigate?: ScreenNames
}

/**
 * when using `useCompleteInteraction` hook you have to define
 * @param handleInteraction - interaction handler, i.e. assemble response token, send response token, etc.
 */
interface CompleteInteraction {
  handleInteraction: () => Promise<Config | void>
}

export const useCompleteInteraction = (
  handleInteraction: CompleteInteraction['handleInteraction'],
) => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const { closeInteraction, clearInteraction } = useFinishInteraction()
  const navigation = useNavigation()

  const { redirectUrl } = useSelector(getDeeplinkConfig)
  const counterparty = useSelector(getInteractionCounterparty)

  const completeInteraction = async () => {
    try {
      const config = await handleInteraction()

      const cleanInteraction = () => {
        clearInteraction()
        closeInteraction(config?.screenToNavigate)

        scheduleInfo({
          title: t('Toasts.successfulInteractionTitle'),
          message: t('Toasts.successfulInteractionMsg'),
          ...config?.toastConfig,
        })
      }

      if (redirectUrl && (await Linking.canOpenURL(redirectUrl))) {
        navigation.dispatch(
          StackActions.replace(ScreenNames.ServiceRedirect, {
            redirectUrl,
            completeRedirect: cleanInteraction,
            counterparty: {
              logo: counterparty?.publicProfile?.image,
              isAnonymous: !getCounterpartyName(counterparty),
              serviceName: getCounterpartyName(counterparty),
            },
          }),
        )
      } else {
        cleanInteraction()
      }
    } catch (e) {
      clearInteraction()
      closeInteraction()

      if (e instanceof Error) {
        if (e.message === SWErrorCodes.SWInteractionOfferAllInvalid) {
          scheduleErrorWarning(e, {
            title: t('Toasts.offerInvalidDocsTitle'),
            message: t('Toasts.offerInvalidDocsMsg', {
              serviceName: getCounterpartyName(counterparty),
            }),
          })
        } else {
          scheduleErrorWarning(e)
        }
      }
    }
  }

  return { completeInteraction }
}
