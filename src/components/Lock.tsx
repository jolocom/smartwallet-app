import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState, AppStateStatus, View, StyleSheet } from 'react-native'
import Keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-community/async-storage'

import {
  isAppLocked,
  isLogged,
  isLocaclAuthSet,
} from '~/modules/account/selectors'
import { lockApp, unlockApp } from '~/modules/account/actions'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import { strings } from '~/translations/strings'

import ScreenContainer from './ScreenContainer'
import Header, { HeaderSizes } from './Header'
import Modal from './Modal'
import PasscodeInput from './PasscodeInput'
import Btn, { BtnTypes } from './Btn'
import AbsoluteBottom from './AbsoluteBottom'
import Paragraph, { ParagraphSizes } from './Paragraph'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [keychainPin, setKeychainPin] = useState('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const getStoredPin = async () => {
    try {
      const [storedBiometry, storedPin] = await Promise.all([
        AsyncStorage.getItem('biometry'),
        Keychain.getGenericPassword({
          service: PIN_SERVICE,
        }),
      ])

      if (storedBiometry) {
        // show biometry view
      } else if (storedPin) {
        // show pin view
        setKeychainPin(storedPin.password)
      }
    } catch (err) {
      // ✍🏼 todo: how should we handle this hasError ?
      console.log({ err })
    }
  }

  useEffect(() => {
    getStoredPin()
  }, [])

  const dispatch = useDispatch()
  const handleAppUnlock = () => {
    if (keychainPin === pin) {
      dispatch(unlockApp())
    } else {
      setHasError(true)
    }
  }

  return (
    <Modal isVisible>
      <ScreenContainer customStyles={{ marginTop: '30%' }}>
        <Paragraph size={ParagraphSizes.large}>
          {strings.ENTER_YOUR_PIN}
        </Paragraph>
        <View style={styles.inputContainer}>
          <PasscodeInput
            value={pin}
            stateUpdaterFn={setPin}
            onSubmit={handleAppUnlock}
            hasError={hasError}
          />
        </View>
        <AbsoluteBottom>
          <Btn type={BtnTypes.secondary} onPress={() => {}}>
            {strings.FORGOT_YOUR_PIN}
          </Btn>
        </AbsoluteBottom>
      </ScreenContainer>
    </Modal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
  },
})

export default function () {
  const isLocked = useSelector(isAppLocked)
  const isLoggedIn = useSelector(isLogged)
  const isAuthSet = useSelector(isLocaclAuthSet)
  const dispatch = useDispatch()

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState === 'background') {
      dispatch(lockApp())
    }
  }

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange)
    return () => {
      AppState.removeEventListener('change', handleAppStateChange)
    }
  }, [])

  if (isLocked && isAuthSet && isLoggedIn) {
    return <Lock />
  }
  return null
}
