import React, { useContext, MutableRefObject } from 'react'
import { initSDK } from './'
import { createContext, useRef, useEffect } from 'react'
import { JolocomSDK } from '@jolocom/sdk'

const SDKContext = createContext<MutableRefObject<JolocomSDK | null> | null>(
  null,
)

export const SDKContextProvider: React.FC = ({ children }) => {
  const sdkRef = useRef<JolocomSDK | null>(null)

  useEffect(() => {
    try {
      ;(async () => {
        const sdk = await initSDK()
        sdkRef.current = sdk
      })()
    } catch (e) {
      throw new Error('Failed to initiate the SDK')
    }
  }, [])

  return <SDKContext.Provider value={sdkRef} children={children} />
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
