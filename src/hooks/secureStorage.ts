import EncryptedStorage from 'react-native-encrypted-storage'

export enum SecureStorageKeys {
  passcode = 'passcode',
}

interface SecureStorage {
  [SecureStorageKeys.passcode]: string
}

export const useSecureStorage = () => {
  const setItem = <T extends SecureStorageKeys>(
    key: T,
    value: SecureStorage[T],
  ) => {
    return EncryptedStorage.setItem(key, value)
  }

  const getItem = async <T extends SecureStorageKeys>(
    key: T,
  ): Promise<SecureStorage[T] | null> => {
    return EncryptedStorage.getItem(key)
  }

  const removeItem = <T extends SecureStorageKeys>(key: T) => {
    return EncryptedStorage.removeItem(key)
  }

  return { setItem, getItem, removeItem }
}
