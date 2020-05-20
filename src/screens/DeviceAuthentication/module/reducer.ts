import Keychain from 'react-native-keychain'

export type StateI = Keychain.BIOMETRY_TYPE | null

const reducer = (state: StateI, action: StateI) => {
  return action
}

export default reducer
