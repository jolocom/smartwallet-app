import React, { useState, useEffect } from 'react'
import Keychain from 'react-native-keychain'
import { ActivityIndicator } from 'react-native'

import PasscodeHeader from '~/components/PasscodeHeader'
import PasscodeInput from '~/components/PasscodeInput'
import Paragraph from '~/components/Paragraph'
import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts'

import SingleSettingView from './SingleSettingView'
import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import { useDispatch } from 'react-redux'
import { setLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import useDelay from '~/hooks/useDelay'

const useGetStoredPin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [keychainPin, setKeychainPin] = useState('')

  const getStoredPin = async () => {
    setIsLoading(true)
    try {
      const storedPin = await Keychain.getGenericPassword({
        service: PIN_SERVICE,
      })

      if (storedPin) {
        // show pin view
        setKeychainPin(storedPin.password)
      } else {
        throw new Error('No PIN set, revisit your flow of setting up PIN')
      }
    } catch (err) {
      // ✍🏼 todo: how should we handle this hasError ?
      console.log({ err })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getStoredPin()
  }, [])

  return { isLoading, keychainPin }
}

const ChangePin = () => {
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const { isLoading, keychainPin } = useGetStoredPin()
  const [hasError, setHasError] = useState(false)
  const [isCreateNew, setIsCreateNew] = useState(false)

  const dispatch = useDispatch()
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const handlePinVerification = async () => {
    if (pin === keychainPin) {
      await useDelay(() => setIsCreateNew(true), 1000)
    } else {
      setHasError(true)
    }
  }

  const handleSetNewPin = async () => {
    resetServiceValuesInKeychain()
    await Keychain.setGenericPassword(PIN_USERNAME, newPin, {
      service: PIN_SERVICE,
      storage: Keychain.STORAGE_TYPE.AES,
    })
    dispatch(
      setLoader({
        type: LoaderTypes.success,
        msg: strings.SUCCESS,
      }),
    )
  }

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  return (
    <SingleSettingView>
      <ScreenContainer
        customStyles={{
          marginTop: '30%',
          justifyContent: 'flex-start',
          paddingTop: 0,
        }}
      >
        <PasscodeHeader>
          {hasError
            ? strings.WRONG_PIN
            : isCreateNew
            ? strings.CREATE_NEW_PASSCODE
            : strings.CURRENT_PASSCODE}
        </PasscodeHeader>
        {isLoading ? (
          <ActivityIndicator />
        ) : isCreateNew ? (
          <PasscodeInput
            value={newPin}
            stateUpdaterFn={setNewPin}
            onSubmit={handleSetNewPin}
          />
        ) : (
          <PasscodeInput
            value={pin}
            stateUpdaterFn={setPin}
            onSubmit={handlePinVerification}
            hasError={hasError}
          />
        )}
      </ScreenContainer>
    </SingleSettingView>
  )
}

export default ChangePin
