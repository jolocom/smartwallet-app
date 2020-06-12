import { useContext } from 'react'
import { SDKContext } from '~/utils/sdk/context'

export const useSDK = () => {
  const sdk = useContext(SDKContext)
  if (!sdk?.current) throw new Error('SDK was not found!')
  return sdk.current
}

export const useMnemonic = () => {
  const sdk = useSDK()

  return (entropy: string) => {
    return sdk.bemw.fromEntropyToMnemonic(Buffer.from(entropy, 'hex'))
  }
}
