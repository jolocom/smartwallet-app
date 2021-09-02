import { SecureStorage } from 'react-native-jolocom'

export enum SecureStorageKeys {
  passcode = 'com.jolocom.wallet-PIN',
}
type TSecureStorage = Record<keyof typeof SecureStorageKeys, string>

export const useSecureStorage = () => {
  const setItem = (key: SecureStorageKeys, value: TSecureStorage) => {
    return SecureStorage.storeValue(key, value)
  }

  const getItem = (key: SecureStorageKeys): Promise<string | null> => {
    return SecureStorage.getValue(key)
  }

  const removeItem = (key: SecureStorageKeys) => {
    return SecureStorage.removeValue(key)
  }

  return { setItem, getItem, removeItem }
}
