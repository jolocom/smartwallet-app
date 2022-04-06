import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'

import { setLocalAuth } from '~/modules/account/actions'
import { useBiometry } from './biometry'
import { BiometryType } from 'react-native-biometrics'
import { SecureStorageKeys, useSecureStorage } from './secureStorage'
import { useToasts } from './toasts'

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
  const [biometryType, setBiometryType] = useState<BiometryType | undefined>(
    undefined,
  )
  const [keychainPin, setKeychainPin] = useState('')
  const [isBiometrySelected, setIsBiometrySelected] = useState(false)

  const { getBiometry } = useBiometry()
  const secureStorage = useSecureStorage()
  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    let isCurrent = true

    setIsLoadingStorage(true)
    Promise.all([
      getBiometry(),
      secureStorage.getItem(SecureStorageKeys.passcode),
    ])
      .then(([storedBiometry, storedPin]) => {
        isCurrent && setBiometryType(storedBiometry?.type)
        if (storedPin) {
          isCurrent && setKeychainPin(storedPin)
        } else {
          throw new Error('No PIN was set, revisit your flow of setting up PIN')
        }
        if (isCurrent) {
          setIsBiometrySelected(!!storedBiometry?.type)
        }
      })
      .catch(scheduleErrorWarning)
      .finally(() => isCurrent && setIsLoadingStorage(false))

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
