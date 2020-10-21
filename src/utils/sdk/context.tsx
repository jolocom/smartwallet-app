import React, {
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'
import { useDispatch } from 'react-redux'
import Keychain from 'react-native-keychain'

import {
  JolocomKeychainPasswordStore,
  SDKError,
  Agent,
  JolocomLinking,
  JolocomWebSockets,
} from 'react-native-jolocom'

import { setDid, setLogged, setLocalAuth } from '~/modules/account/actions'

import { initSDK } from './'
import { PIN_SERVICE } from '../keychainConsts'
import ScreenContainer from '~/components/ScreenContainer'

export const AgentContext = createContext<MutableRefObject<Agent | null> | null>(
  null,
)

export const AgentContextProvider: React.FC = ({ children }) => {
  const agentRef = useRef<Agent | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  const initializeAll = async () => {
    //TODO move this functionality into a hook
    try {
      let [sdk, pin] = await Promise.all([
        initSDK(),
        Keychain.getGenericPassword({
          service: PIN_SERVICE,
        }),
      ])
      await sdk.usePlugins(new JolocomLinking(), new JolocomWebSockets())
      sdk.setDefaultDidMethod('jun')

      const passwordStore = new JolocomKeychainPasswordStore()
      const agent = new Agent({ passwordStore, sdk })
      agentRef.current = agent

      // NOTE: If loading the identity fails, we don't set the did and the logged state, thus navigating
      // to the @LoggedOut section
      const idw = await agent.loadIdentity()
      dispatch(setDid(idw.did))
      dispatch(setLogged(true))

      if (pin) {
        dispatch(setLocalAuth(true))
      }
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
