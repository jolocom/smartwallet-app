import { useEffect } from 'react'
import { Interaction } from 'react-native-jolocom'
import { useAgent } from '../sdk'

enum HistoryEvents {
  updated = 'updated',
  created = 'created',
}

const historyHookFactory =
  (event: HistoryEvents) => (cb: (id: Interaction) => void) => {
    const agent = useAgent()

    useEffect(() => {
      const unsubscribe = agent.interactionManager.on(event, cb)

      return unsubscribe
    }, [])
  }

export const useHistoryUpdate = historyHookFactory(HistoryEvents.updated)
export const useHistoryCreate = historyHookFactory(HistoryEvents.created)
