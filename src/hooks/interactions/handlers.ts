/**
 * NOTE @clauxx
 *
 * This file was renamed from `index.ts` to `handlers.ts` due to (probably) an issue
 * with module caching, that appeared after upgrading to RN63.
 */

import { useDispatch, useSelector } from 'react-redux'

import { useLoader } from '../loader'
import {
  resetInteraction,
  setInteractionDetails,
} from '~/modules/interaction/actions'
import { getInteractionId } from '~/modules/interaction/selectors'
import { useAgent } from '../sdk'
import { useNavigation } from '@react-navigation/native'
import { ScreenNames } from '~/types/screens'
import { useInteractionHandler } from './interactionHandlers'
import { useToasts } from '../toasts'
import { parseJWT } from '~/utils/parseJWT'
import useConnection from '../connection'
import { Interaction } from 'react-native-jolocom'

export const useInteraction = () => {
  const agent = useAgent()
  const interactionId = useSelector(getInteractionId)
  if (!interactionId) throw new Error('Interaction not found')

  return () => agent.interactionManager.getInteraction(interactionId)
}

export const useInteractionStart = () => {
  const agent = useAgent()
  const dispatch = useDispatch()
  const loader = useLoader()
  const interactionHandler = useInteractionHandler()
  const { connected, showDisconnectedToast } = useConnection()
  const { scheduleErrorWarning } = useToasts()

  const processInteraction = async (jwt: string) => {
    parseJWT(jwt)
    const interaction = await agent.processJWT(jwt)

    return interaction
  }

  const showInteraction = async (interaction: Interaction) => {
    console.log('showing interaction')
    // NOTE: not continuing the interaction if there is no network connection
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
  }

  const startInteraction = async (jwt: string) => {
    return loader(
      async () => {
        const interaction = await processInteraction(jwt)
        await showInteraction(interaction)
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

  return (screen?: ScreenNames) => {
    if (screen) {
      navigation.navigate(screen)
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigation.navigate(ScreenNames.Main)
      }
    }
    setTimeout(() => {
      dispatch(resetInteraction())
    }, 500)
  }
}
