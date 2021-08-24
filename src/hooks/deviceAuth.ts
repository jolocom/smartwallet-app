import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setLocalAuth } from '~/modules/account/actions'
import { useBiometry } from './biometry'
import { BiometryType } from 'react-native-biometrics'
import { SecureStorageKeys, useSecureStorage } from './secureStorage'

export const useResetKeychainValues = () => {
  const dispatch = useDispatch()
  const secureStorage = useSecureStorage()
  const resetServiceValuesInKeychain = async () => {
    try {
      await secureStorage.removeItem(SecureStorageKeys.passcode)
      dispatch(setLocalAuth(false))
    } catch (err) {
      console.log({ err })
    }
  }
  return resetServiceValuesInKeychain
}

export const useGetStoredAuthValues = () => {
  const [isLoadingStorage, setIsLoadingStorage] = useState(false)
  const [biometryType, setBiometryType] =
    useState<BiometryType | undefined>(undefined)
  const [keychainPin, setKeychainPin] = useState('')
  const [isBiometrySelected, setIsBiometrySelected] = useState(false)

  const { getBiometry } = useBiometry()
  const secureStorage = useSecureStorage()

  useEffect(() => {
    let isCurrent = true

    const getStoredPin = async () => {
      setIsLoadingStorage(true)
      try {
        const [storedBiometry, storedPin] = await Promise.all([
          getBiometry(),
          secureStorage.getItem(SecureStorageKeys.passcode),
        ])

        isCurrent && setBiometryType(storedBiometry?.type)
        if (storedPin) {
          isCurrent && setKeychainPin(storedPin)
        } else {
          throw new Error('No PIN was set, revisit your flow of setting up PIN')
        }
        if (isCurrent) {
          setIsBiometrySelected(!!storedBiometry?.type)
        }
      } catch (err) {
        // ✍🏼 todo: how should we handle this hasError ?
        console.log({ err })
      } finally {
        isCurrent && setIsLoadingStorage(false)
      }
    }
    getStoredPin()
    return () => {
      isCurrent = false
    }
  }, [])

  return {
    isLoadingStorage,
    biometryType,
    keychainPin,
    isBiometrySelected,
  }
}
