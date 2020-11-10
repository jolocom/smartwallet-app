import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import Keychain from 'react-native-keychain'

import { setLocalAuth } from '~/modules/account/actions'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { BiometryTypes } from '~/screens/Modals/DeviceAuthentication/module/deviceAuthTypes'
import { useAgent } from './sdk'

export const useResetKeychainValues = (service: string) => {
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

export const useGetStoredAuthValues = () => {
  const [isLoadingStorage, setIsLoadingStorage] = useState(false)
  const [biometryType, setBiometryType] = useState<BiometryTypes>(null)
  const [keychainPin, setKeychainPin] = useState('')
  const [isBiometrySelected, setIsBiometrySelected] = useState(false)

  const agent = useAgent();

  useEffect(() => {
    let isCurrent = true

    const getStoredPin = async () => {
      setIsLoadingStorage(true)
      try {
        const [storedBiometry, storedPin] = await Promise.all([
          agent.storage.get.setting('biometry'),
          Keychain.getGenericPassword({
            service: PIN_SERVICE,
          }),
        ])

        isCurrent && setBiometryType(storedBiometry.type as BiometryTypes)
        if (storedPin) {
          isCurrent && setKeychainPin(storedPin.password)
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
