import { SecureStorage } from 'react-native-jolocom'

export enum SecureStorageKeys {
  passcode = 'com.jolocom.wallet-PIN',
}

export const useSecureStorage = () => {
  const setItem = (key: SecureStorageKeys, value: string) =>
    SecureStorage.storeValue(key, value)

  const getItem = (key: SecureStorageKeys): Promise<string | null> =>
    SecureStorage.getValue(key)

  const removeItem = (key: SecureStorageKeys) => SecureStorage.removeValue(key)

  return { setItem, getItem, removeItem }
}
