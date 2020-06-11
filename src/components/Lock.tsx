import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { AppState, AppStateStatus, View, StyleSheet } from 'react-native'
import Keychain from 'react-native-keychain'

import { isAppLocked, isLogged } from '~/modules/account/selectors'
import { lockApp, unlockApp } from '~/modules/account/actions'

import ScreenContainer from './ScreenContainer'
import Header from './Header'
import Modal from './Modal'
import PasscodeInput from './PasscodeInput'
import { PIN_SERVICE } from '~/utils/keychainConsts'
import Paragraph from './Paragraph'
import AsyncStorage from '@react-native-community/async-storage'

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
      console.log({ storedBiometry })
      console.log({ storedPin })

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
      <ScreenContainer customStyles={{ paddingTop: 80 }}>
        <Header>Provide your PIN</Header>
        <Paragraph>
          To gain access to the app please provide your Smart Wallet PIN
        </Paragraph>
        <View style={styles.inputContainer}>
          <PasscodeInput
            value={pin}
            stateUpdaterFn={setPin}
            onSubmit={handleAppUnlock}
            hasError={hasError}
          />
        </View>
      </ScreenContainer>
    </Modal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: '30%',
  },
})

export default function () {
  const isLocked = useSelector(isAppLocked)
  const isLoggedIn = useSelector(isLogged)
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

  if (isLocked && isLoggedIn) {
    return <Lock />
  }
  return null
}
