import React, {
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'

import { Agent } from 'react-native-jolocom'

import ScreenContainer from '~/components/ScreenContainer'
import { useWalletInit } from '~/hooks/sdk'
import { initAgent } from '.'

export const AgentContext = createContext<MutableRefObject<Agent | null> | null>(
  null,
)

export const AgentContextProvider: React.FC = ({ children }) => {
  const agentRef = useRef<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initWallet = useWalletInit()

  const initializeAll = async () => {
    try {
      const agent = await initAgent()
      agentRef.current = agent

      await initWallet(agent)
    } catch (err) {
      console.warn(err)
      throw new Error('Agent initialization failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    initializeAll()
    return () => {
      setIsLoading(false)
      agentRef.current = null
    }
  }, [])

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar
          backgroundColor={'transparent'}
          animated
          translucent
          barStyle="light-content"
        />
        <ActivityIndicator />
      </ScreenContainer>
    )
  }
  return <AgentContext.Provider value={agentRef} children={children} />
}
