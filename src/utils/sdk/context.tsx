import React, {
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'

import { SDKError, Agent } from 'react-native-jolocom'

import ScreenContainer from '~/components/ScreenContainer'
import { useWalletInit } from '~/hooks/sdk'

export const AgentContext = createContext<MutableRefObject<Agent | null> | null>(
  null,
)

export const AgentContextProvider: React.FC = ({ children }) => {
  const agentRef = useRef<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initWallet = useWalletInit()

  const initializeAll = async () => {
    try {
      const agent = await initWallet()
      agentRef.current = agent
    } catch (err) {
      if (err.code !== SDKError.codes.NoWallet) {
        console.warn(err)
        throw new Error('Root initialization failed')
      }
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
