/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useDispatch, useSelector } from 'react-redux'

import { useNavigation } from '@react-navigation/native'
import { Interaction, TransportAPI } from 'react-native-jolocom'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import {
  getInteractionId,
  getInteractionType,
} from '~/modules/interaction/selectors'
import { ScreenNames } from '~/types/screens'
import { parseJWT } from '~/utils/parseJWT'
import useConnection from '../connection'
import { useAgent } from '../sdk'
import { useToasts } from '../toasts'
import { useInteractionHandler } from './interactionHandlers'
import { useEffect } from 'react'
import { getIsAppLocked } from '~/modules/account/selectors'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const navigation = useNavigation()
  const interactionHandler = useInteractionHandler()
  const { scheduleErrorWarning } = useToasts()
  const { connected, showDisconnectedToast } = useConnection()

  const isInteracting = useSelector(getInteractionType)
  const isAppLocked = useSelector(getIsAppLocked)

  useEffect(() => {
    if (!isAppLocked && isInteracting) {
      navigation.navigate(ScreenNames.Interaction)
    }
  }, [isAppLocked, isInteracting])

  const processInteraction = async (
    jwt: string,
    transportAPI?: TransportAPI,
  ) => {
    try {
      parseJWT(jwt)
      const interaction = await agent.processJWT(jwt, transportAPI)

      return interaction
    } catch (e) {
      if (e instanceof Error) scheduleErrorWarning(e)
    }
  }

  const showInteraction = async (interaction: Interaction) => {
    // NOTE: not continuing the interaction if there is no network connection
    if (connected === false) return showDisconnectedToast()
    try {
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
      if (e instanceof Error) scheduleErrorWarning(e)
    }
  }

  const startInteraction = async (jwt: string) => {
    try {
      const interaction = await processInteraction(jwt)
      if (interaction) {
        await showInteraction(interaction)
      }
    } catch (e) {
      if (e instanceof Error) {
        scheduleErrorWarning(e)
      }
    }
  }

  return {
    processInteraction,
    showInteraction,
    startInteraction,
  }
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
