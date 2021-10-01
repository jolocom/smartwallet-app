import { useEffect } from 'react'
import { Interaction } from 'react-native-jolocom'
import { InteractionEvents } from '@jolocom/sdk/js/interactionManager/interactionManager'
import { useAgent } from '../sdk'

const interactionListenerFactory =
  (event: keyof InteractionEvents) =>
  (cb: (interaction: Interaction) => void) => {
    const agent = useAgent()

    useEffect(() => {
      const unsubscribe = agent.interactionManager.on(event, cb)

      return unsubscribe
    }, [])
  }

export const useInteractionUpdate =
  interactionListenerFactory('interactionUpdated')
export const useInteractionCreate =
  interactionListenerFactory('interactionCreated')
export const useInteractionResumed =
  interactionListenerFactory('interactionResumed')
