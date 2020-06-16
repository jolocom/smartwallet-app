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

  const getStoredPin = async () => {
    setIsLoadingStorage(true)
    try {
      const [storedBiometry, storedPin] = await Promise.all([
        AsyncStorage.getItem('biometry'),
        Keychain.getGenericPassword({
          service: PIN_SERVICE,
        }),
      ])

      setBiometryType(storedBiometry as BiometryTypes)
      if (storedPin) {
        setKeychainPin(storedPin.password)
      } else {
        throw new Error('No PIN was set, revisit your flow of setting up PIN')
      }
      if (storedBiometry) {
        // show biometry view
        setIsBiometryShow(true)
      } else {
        // show pin view
        setIsBiometryShow(false)
      }
    } catch (err) {
      // ✍🏼 todo: how should we handle this hasError ?
      console.log({ err })
    } finally {
      setIsLoadingStorage(false)
    }
  }

  useEffect(() => {
    getStoredPin()
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
