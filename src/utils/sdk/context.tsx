import React, {
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'
import RNBootSplash from 'react-native-bootsplash'
import { Agent } from 'react-native-jolocom'

import ScreenContainer from '~/components/ScreenContainer'
import { useWalletInit } from '~/hooks/sdk'
import { initAgent } from '.'
import useTranslation from '~/hooks/useTranslation'
import { aa2Module } from '@jolocom/react-native-ausweis'

export const AgentContext =
  createContext<MutableRefObject<Agent | null> | null>(null)

export const AgentContextProvider: React.FC = ({ children }) => {
  const agentRef = useRef<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const initWallet = useWalletInit()
  const { initStoredLanguage } = useTranslation()

  const initAusweis = async () => {
    //await aa2Module.initAa2Sdk()
    if (!aa2Module.isInitialized) {
      try {
        //await aa2Module.cancelFlow()
        await aa2Module.initAa2Sdk()
      } catch (e) {
        // NOTE: Can't use a toast since the @Toast component uses the navigation,
        // which is not available here.
        console.warn(e)
        console.warn("Oopsie! Couldn't initiate the Ausweis SDK!")
      }
    }
  }

  const initializeAll = async () => {
    try {
      const agent = await initAgent()
      agentRef.current = agent

      await initWallet(agent)
      await initStoredLanguage(agent)
      await initAusweis()
    } catch (err) {
      console.warn('Error initializing the agent', err)
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

  useEffect(() => {
    const hideSplash = async () => {
      await RNBootSplash.hide({ fade: true })
    }
    if (!isLoading) hideSplash()
  }, [isLoading])

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
