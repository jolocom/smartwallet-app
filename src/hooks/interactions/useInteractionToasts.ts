import { StackActions, useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import { IdentitySummary } from 'react-native-jolocom'
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
import truncateDid from '~/utils/truncateDid'
import useTranslation from '../useTranslation'
import { useFinishInteraction } from './handlers'

interface Config {
  successToast?: Partial<ToastBody>
  terminate?: boolean
  terminateHandler?: () => void
}

interface CompleteInteraction {
  handleInteraction: () => Promise<Config | undefined>
  screenNavigateToAfterInteraction?: ScreenNames
}

export const useCompleteInteraction = (
  handleInteraction: CompleteInteraction['handleInteraction'],
  screenNavigateToAfterInteraction?: CompleteInteraction['screenNavigateToAfterInteraction'],
) => {
  const { t } = useTranslation()
  const { scheduleInfo, scheduleErrorWarning } = useToasts()
  const { closeInteraction, clearInteraction } = useFinishInteraction()
  const navigation = useNavigation()

  // This value will be used to "remember" interaction counterparty before its reset in the store
  const counterpartyInfo =
    useRef<{ counterparty: IdentitySummary; redirectUrl: string | null }>()
  const shadowRedirectUrl = useRef<string | null>(null)
  const redirectUrl = useSelector(getRedirectUrl)
  const counterparty = useSelector(getInteractionCounterparty)

  useEffect(() => {
    shadowRedirectUrl.current = redirectUrl
  }, [redirectUrl])

  const completeInteractionObj = useRef<AsyncGenerator>()

  useEffect(() => {
    completeInteractionObj.current = makeCompleteInteraction(
      handleInteraction,
      screenNavigateToAfterInteraction,
    )
  }, [])

  const makeCompleteInteraction = async function* (
    handleInteraction: CompleteInteraction['handleInteraction'],
    screenNavigateToAfterInteraction: CompleteInteraction['screenNavigateToAfterInteraction'],
  ) {
    try {
      // Store counterparty information to be used in the redirct url
      counterpartyInfo.current = {
        counterparty,
        redirectUrl: shadowRedirectUrl.current,
      }

      const config = await handleInteraction()

      // NOTE: anywhere where the interaction has to pause before completing return from the interaction handler terminate property of value true,i.e. in "renegotiation" scenario
      if (config?.terminate === true) {
        yield config?.terminateHandler && config?.terminateHandler()
      }

      clearInteraction()

      if (
        counterpartyInfo.current?.redirectUrl &&
        (await Linking.canOpenURL(counterpartyInfo.current?.redirectUrl))
      ) {
        yield navigation.dispatch(
          StackActions.replace(ScreenNames.InteractionRedirect, {
            ...counterpartyInfo.current,
            completeRedirect: completeInteraction,
          }),
        )
      }

      scheduleInfo({
        title: t('Toasts.successfulInteractionTitle'),
        message: t('Toasts.successfulInteractionMsg'),
        ...config?.successToast,
      })
    } catch (e) {
      if (e.message === SWErrorCodes.SWInteractionOfferAllInvalid) {
        scheduleErrorWarning(e, {
          title: t('Toasts.offerInvalidDocsTitle'),
          message: t('Toasts.offerInvalidDocsMsg', {
            serviceName: getCounterpartyName(
              counterpartyInfo.current?.counterparty,
            ),
          }),
        })
      } else {
        scheduleErrorWarning(e)
      }
    } finally {
      closeInteraction(screenNavigateToAfterInteraction)
    }
  }

  const completeInteraction = async () => {
    if (completeInteractionObj.current?.next === undefined) {
      throw new Error('Generator object was not populated')
    }
    await completeInteractionObj.current.next()
  }

  return { completeInteraction }
}
