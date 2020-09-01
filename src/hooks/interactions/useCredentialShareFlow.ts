import { useDispatch } from 'react-redux'
import { useSDK, useInteraction } from '../sdk'

export const useCredentialShareFlow = () => {
  const dispatch = useDispatch()
  const sdk = useSDK()
  const interaction = useInteraction()

  //TODO: add submit methods
  return {}
}
