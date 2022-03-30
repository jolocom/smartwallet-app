/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { useLoader } from '../loader'
import {
  resetInteraction,
  setInteractionDetails,
  setRedirectUrl,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { useAgent } from '../sdk'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useInteractionHandler } from './interactionHandlers'
import { useToasts } from '../toasts'
import { parseJWT } from '~/utils/parseJWT'
import useConnection from '../connection'
import { Interaction, TransportAPI } from 'react-native-jolocom'
import branch from 'react-native-branch'
import { SWErrorCodes } from '~/errors/codes'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

// NOTE: This should be called only in one place!
export const useDeeplinkInteractions = () => {
  const { processInteraction } = useInteractionStart()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    // TODO move somewhere
    branch.disableTracking(true)
    branch.subscribe(({ error, params }) => {
      if (error) {
        console.warn('Error processing DeepLink: ', error)
        return
      }

      if (params) {
        let redirectUrl: string | undefined = undefined

        if (
          params['redirectUrl'] &&
          typeof params['redirectUrl'] === 'string'
        ) {
          redirectUrl = params['redirectUrl']
        }

        if (params['token'] && typeof params['token'] === 'string') {
          processInteraction(params['token'], redirectUrl)
          return
        } else if (
          !params['+clicked_branch_link'] ||
          JSON.stringify(params) === '{}'
        ) {
          return
        }

        scheduleErrorWarning(new Error(SWErrorCodes.SWUnknownDeepLink))
      }
    })
  }, [])
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()
  const interactionHandler = useInteractionHandler()
  const { connected, showDisconnectedToast } = useConnection()
  const { scheduleErrorWarning } = useToasts()

  const processInteraction = async (
    jwt: string,
    redirectUrl?: string,
    transportAPI?: TransportAPI,
  ) => {
    try {
      parseJWT(jwt)
      const interaction = await agent.processJWT(jwt, transportAPI)

      if (redirectUrl) {
        dispatch(setRedirectUrl(redirectUrl))
      }

      return interaction
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const showInteraction = async (interaction: Interaction) => {
    // NOTE: not continuing the interaction if there is no network connection
    try {
      if (connected === false) return showDisconnectedToast()

      const counterparty = interaction.getSummary().initiator
      const interactionData = await interactionHandler(interaction)

      if (interactionData) {
        dispatch(
          setInteractionDetails({
            id: interaction.id,
            flowType: interaction.flow.type,
            counterparty,
            ...interactionData,
          }),
        )
      }
    } catch (e) {
      scheduleErrorWarning(e)
    }
  }

  const startInteraction = async (jwt: string) => {
    return loader(
      async () => {
        const interaction = await processInteraction(jwt)
        if (interaction) {
          await showInteraction(interaction)
        }
      },
      { showSuccess: false, showFailed: false },
      (error) => {
        if (error) scheduleErrorWarning(error)
      },
    )
  }

  return { processInteraction, showInteraction, startInteraction }
}

export const useFinishInteraction = () => {
  const dispatch = useDispatch()
  const navigation = useNavigation()

  const closeInteraction = (screen?: ScreenNames) => {
    if (screen) {
      navigation.navigate(screen)
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate(ScreenNames.Main)
      }
    }
  }

  const clearInteraction = () => {
    dispatch(resetInteraction(undefined))
  }

  return { closeInteraction, clearInteraction }
}
