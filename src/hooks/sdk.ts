import { useContext } from 'react'
import { SDKContext } from '~/utils/sdk/context'

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
