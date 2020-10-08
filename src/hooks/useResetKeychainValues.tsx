import Keychain from 'react-native-keychain'
import { useDispatch } from 'react-redux'
import { setLocalAuth } from '~/modules/account/actions'

const useResetKeychainValues = (service: string) => {
  const dispatch = useDispatch()
  const resetServiceValuesInKeychain = async () => {
    try {
      await Keychain.resetGenericPassword({
        service,
      })
      dispatch(setLocalAuth(false))
    } catch (err) {
      console.log({ err })
    }
  }
  return resetServiceValuesInKeychain
}

export default useResetKeychainValues
