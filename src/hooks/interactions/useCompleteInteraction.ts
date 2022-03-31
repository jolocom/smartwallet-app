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
import useTranslation from '../useTranslation'
import { useFinishInteraction } from './handlers'

/**
 * interaction handler can return this object:
 * @return { successToast: Partial<ToastBody> } will override defaule success interaction toast
 * @return { pause: true, pauseHandler: () => void } will pause interaction complete execution and call your custom logic contained within pauseHandler
 */
interface Config {
  successToast?: Partial<ToastBody>
  pause?: boolean
  pauseHandler?: () => void
}

/**
 * when using `useCompleteInteraction` hook you have to define
 * @param handleInteraction - interaction handler, i.e. assemble response token, send response token, etc.
 * @param screenNavigateToAfterInteraction - after an interaction has completed user will be navigated to this screen is provided
 */
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

  /*
   * Creating a generator object to iterate over the generator `makeCompleteInteraction`
   */
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

      /**
       * returning object with `successToken` property will override the default success token;
       * returning object with `pause` and `pauseHandler` will pause interaction complete execution
       */
      const config = await handleInteraction()

      /**
       * NOTE: anywhere where the interaction has to pause before completing
       * return from the interaction handler pause property of value true,i.e. in "renegotiation" scenario
       */
      if (config?.pause === true) {
        yield config?.pauseHandler && config?.pauseHandler()
      }

      /**
       * NOTE: interaction is reset. If you won't reset it here, the interaction sheet will
       * always be rendered on top of any other screen if the interaction details values are still in the store
       */
      clearInteraction()

      /**
       * Pause interaction complete if the redirectUrl was provided by a counterparty
       */
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
      clearInteraction()

      // TODO: define custom wallet Error class to declaratively use toast body
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
      // TODO: perhaps we don't want to navigate user to a different screen in an interaction failed
      closeInteraction(screenNavigateToAfterInteraction)
    }
  }

  /**
   * NOTE: this function will start an interaction flow or
   * will continue an interaction complete flow if it was paused by `yield` keyword
   */
  const completeInteraction = async () => {
    if (completeInteractionObj.current?.next === undefined) {
      throw new Error('Generator object was not populated')
    }
    await completeInteractionObj.current.next()
  }

  return { completeInteraction }
}
