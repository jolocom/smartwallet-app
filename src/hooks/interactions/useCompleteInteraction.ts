import { StackActions, useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { SWErrorCodes } from '~/errors/codes'
import { useToasts } from '~/hooks/toasts'
import {
  getInteractionCounterparty,
  getRedirectUrl,
} from '~/modules/interaction/selectors'
import { ScreenNames } from '~/types/screens'
import { ToastBody } from '~/types/toasts'
import { getCounterpartyName } from '~/utils/dataMapping'
import useTranslation from '../useTranslation'
import { useFinishInteraction } from './handlers'

/**
 * interaction handler can return this object:
 * @return { successToast: Partial<ToastBody> } will override defaule success interaction toast
 * @return { pause: true, pauseHandler: () => void } will pause interaction complete execution and call your custom logic contained within pauseHandler
 */
interface Config {
  successToast?: Partial<ToastBody>
  screenToNavigate?: ScreenNames
}

/**
 * when using `useCompleteInteraction` hook you have to define
 * @param handleInteraction - interaction handler, i.e. assemble response token, send response token, etc.
 * @param screenNavigateToAfterInteraction - after an interaction has completed user will be navigated to this screen is provided
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

  const redirectUrl = useSelector(getRedirectUrl)
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
          ...config?.successToast,
        })
      }

      if (redirectUrl && (await Linking.canOpenURL(redirectUrl))) {
        navigation.dispatch(
          StackActions.replace(ScreenNames.InteractionRedirect, {
            redirectUrl,
            counterparty,
            completeRedirect: cleanInteraction,
          }),
        )
      } else {
        cleanInteraction()
      }
    } catch (e) {
      clearInteraction()

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
