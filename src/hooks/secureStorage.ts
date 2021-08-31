import { SecureStorage } from 'react-native-jolocom/js/secureStorage'

export enum SecureStorageKeys {
  passcode = 'com.jolocom.wallet-PIN',
}

interface ISecureStorage {
  [SecureStorageKeys.passcode]: string
}

export const useSecureStorage = () => {
  const setItem = <T extends SecureStorageKeys>(
    key: T,
    value: ISecureStorage[T],
  ) => {
    return SecureStorage.storeValue(key, value)
  }

  const getItem = async <T extends SecureStorageKeys>(
    key: T,
  ): Promise<ISecureStorage[T] | null> => {
    return SecureStorage.getValue(key)
  }

  const removeItem = <T extends SecureStorageKeys>(key: T) => {
    return SecureStorage.removeValue(key)
  }

  return { setItem, getItem, removeItem }
}
