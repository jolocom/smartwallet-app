import { useEffect } from 'react'
import { Interaction } from 'react-native-jolocom'
import { InteractionEvents } from '@jolocom/sdk/js/interactionManager/interactionManager'
import { useAgent } from '../sdk'

type TInteractionHandler = (interaction: Interaction) => void

const interactionListenerFactory =
  (event: keyof InteractionEvents) => (handler: TInteractionHandler) => {
    const agent = useAgent()

    useEffect(() => {
      const unsubscribe = agent.interactionManager.on(event, handler)

      return unsubscribe
    }, [])
  }

export const useInteractionUpdate =
  interactionListenerFactory('interactionUpdated')
export const useInteractionCreate =
  interactionListenerFactory('interactionCreated')
export const useInteractionResumed =
  interactionListenerFactory('interactionResumed')

// NOTE: handles all of the interaction events
export const useInteractionEvents = (handler: TInteractionHandler) => {
  useInteractionCreate(handler)
  useInteractionUpdate(handler)
  useInteractionResumed(handler)
}
