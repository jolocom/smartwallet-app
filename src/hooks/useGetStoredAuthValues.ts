import { useState, useEffect } from 'react'
import Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'

import { PIN_SERVICE } from '~/utils/keychainConsts'
import { BiometryTypes } from '~/screens/DeviceAuthentication/module/deviceAuthTypes'

const useGetStoredAuthValues = () => {
  const [isLoadingStorage, setIsLoadingStorage] = useState(false)
  const [biometryType, setBiometryType] = useState<BiometryTypes>(null)
  const [keychainPin, setKeychainPin] = useState('')
  const [isBiometryShown, setIsBiometryShow] = useState(false)

  useEffect(() => {
    let isCurrent = true

    const getStoredPin = async () => {
      setIsLoadingStorage(true)
      try {
        const [storedBiometry, storedPin] = await Promise.all([
          AsyncStorage.getItem('biometry'),
          Keychain.getGenericPassword({
            service: PIN_SERVICE,
          }),
        ])

        isCurrent && setBiometryType(storedBiometry as BiometryTypes)
        if (storedPin) {
          isCurrent && setKeychainPin(storedPin.password)
        } else {
          throw new Error('No PIN was set, revisit your flow of setting up PIN')
        }
        if (storedBiometry) {
          // show biometry view
          isCurrent && setIsBiometryShow(true)
        } else {
          // show pin view
          isCurrent && setIsBiometryShow(false)
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
    isBiometryShown,
    setIsBiometryShow,
  }
}

export default useGetStoredAuthValues
