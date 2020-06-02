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
import { setDid, setLogged } from '~/modules/account/actions'
import { useDispatch } from 'react-redux'

export const SDKContext = createContext<MutableRefObject<JolocomSDK | null> | null>(
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
            dispatch(setDid(iw.did))
            dispatch(setLogged(true))
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

    return () => {
      setLoaded(false)
      sdkRef.current = null
    }
  }, [])

  return !loaded ? (
    <View style={{ width: '100%', height: '100%', backgroundColor: 'red' }} />
  ) : (
    <SDKContext.Provider value={sdkRef} children={children} />
  )
}
