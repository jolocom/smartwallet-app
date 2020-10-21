import React, {
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { ActivityIndicator, StatusBar } from 'react-native'
import { useDispatch } from 'react-redux'
import { JolocomSDK } from '@jolocom/sdk'
import Keychain from 'react-native-keychain'

import { setDid, setLogged, setLocalAuth } from '~/modules/account/actions'

import { initSDK } from './'
import { PIN_SERVICE } from '../keychainConsts'
import ScreenContainer from '~/components/ScreenContainer'
import { BackendMiddlewareErrorCodes } from '@jolocom/sdk/js/src/lib/errors/types'

export const SDKContext = createContext<MutableRefObject<JolocomSDK | null> | null>(
  null,
)

export const SDKContextProvider: React.FC = ({ children }) => {
  const sdkRef = useRef<JolocomSDK | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const dispatch = useDispatch()

  const initializeAll = async () => {
    try {
      let [sdk, pin] = await Promise.all([
        initSDK(),
        Keychain.getGenericPassword({
          service: PIN_SERVICE,
        }),
      ])

      sdkRef.current = sdk
      let iw = await sdk.init({ dontAutoRegister: true })
      if (iw.did) {
        dispatch(setDid(iw.did))
        dispatch(setLogged(true))
      }

      if (pin) {
        dispatch(setLocalAuth(true))
      }
    } catch (err) {
      if (err.message !== BackendMiddlewareErrorCodes.NoEntropy) {
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
      sdkRef.current = null
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
  return <SDKContext.Provider value={sdkRef} children={children} />
}
