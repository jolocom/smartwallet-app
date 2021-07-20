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

  return async (jwt: string) => {
    // NOTE: not continuing the interaction if there is no network connection
    if (connected === false) return showDisconnectedToast()

    // NOTE: we're parsing the jwt here, even though it will be parsed in `agent.processJWT`
    // below. This is to assure the error is caught before the loading screen, so that it can
    // be handled by the scanner component.
    parseJWT(jwt)

    return loader(
      async () => {
        const interaction = await agent.processJWT(jwt)
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
      },
      { showSuccess: false, showFailed: false },
      (error) => {
        if (error) scheduleErrorWarning(error)
      },
    )
  }
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
