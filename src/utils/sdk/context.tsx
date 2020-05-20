import React, {
  useContext,
  useState,
  MutableRefObject,
  createContext,
  useRef,
  useEffect,
} from 'react'
import { View } from 'react-native'
import { initSDK } from './'
import { JolocomSDK } from '@jolocom/sdk'
import { setDid } from '~/modules/account/actions'
import { useDispatch } from 'react-redux'

const SDKContext = createContext<MutableRefObject<JolocomSDK | null> | null>(
  null,
)

export const SDKContextProvider: React.FC = ({ children }) => {
  const sdkRef = useRef<JolocomSDK | null>(null)
  const [loaded, setLoaded] = useState(false)
  const dispatch = useDispatch()

  useEffect(() => {
    initSDK()
      .then((sdk) => {
        sdkRef.current = sdk
        sdk
          .init({ dontAutoRegister: true })
          .then((iw) => {
            console.log(iw.did)
            dispatch(setDid(iw.did))
          })
          .catch(console.warn)
          .finally(() => {
            setLoaded(true)
          })
      })
      .catch((e) => {
        console.warn(e)
        throw new Error('Failed to initiate the SDK')
      })
  }, [])

  return !loaded ? (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'red' }} />
  ) : (
    <SDKContext.Provider value={sdkRef} children={children} />
  )
}

export const useSDK = () => {
  const sdk = useContext(SDKContext)
  if (!sdk?.current) throw new Error('SDK was not found!')
  return sdk.current
}

export const useMnemonic = () => {
  const sdk = useSDK()

  return async () => {
    const password = await sdk.bemw.keyChainLib.getPassword()
    const mnemonic = sdk.bemw.keyProvider.getMnemonic(password)
    return mnemonic
  }
}
