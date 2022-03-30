import { StackActions, useNavigation } from '@react-navigation/native'
import { useEffect, useRef } from 'react'
import { Linking } from 'react-native'
import { useSelector } from 'react-redux'
import { SWErrorCodes } from '~/errors/codes'
import { useToasts } from '~/hooks/toasts'
import { getRedirectUrl } from '~/modules/interaction/selectors'
import { ScreenNames } from '~/types/screens'
import { ToastBody } from '~/types/toasts'
import { getCounterpartyName } from '~/utils/dataMapping'
import useTranslation from '../useTranslation'
import { useFinishInteraction } from './handlers'

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
  const redirectUrl = useSelector(getRedirectUrl)
  const serviceName = useSelector(getCounterpartyName)
  const navigation = useNavigation()

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
      const config = await handleInteraction()

      // NOTE: anywhere where the interaction has to pause before completing return from the interaction handler terminate property of value true,i.e. in "renegotiation" scenario
      if (config?.terminate === true) {
        yield config?.terminateHandler && config?.terminateHandler()
      }

      clearInteraction()

      console.log({ redirectUrl })
      //if (!!redirectUrl && (await Linking.canOpenURL(redirectUrl))) {
      yield navigation.dispatch(
        StackActions.replace(ScreenNames.InteractionRedirect, {
          serviceName,
          completeRedirect: completeInteraction,
        }),
      )
      //}

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
            serviceName,
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

export default useInteractionToasts
