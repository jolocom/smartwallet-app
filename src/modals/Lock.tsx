import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppStateStatus,
  View,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native'

import {
  isAppLocked,
  isLogged,
  isLocalAuthSet,
} from '~/modules/account/selectors'
import { lockApp, unlockApp } from '~/modules/account/actions'
import { strings } from '~/translations/strings'

import ScreenContainer from '../components/ScreenContainer'
import Modal from './Modal'
import PasscodeInput from '../components/PasscodeInput'
import Btn, { BtnTypes } from '../components/Btn'
import AbsoluteBottom from '../components/AbsoluteBottom'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { getBiometryDescription } from '~/screens/DeviceAuthentication/utils/getText'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import useGetStoredAuthValues from '~/hooks/useGetStoredAuthValues'
import Header from '~/components/Header'
import { useAppState } from '~/hooks/useAppState'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const dispatch = useDispatch()
  const {
    isLoadingStorage,
    biometryType,
    keychainPin,
    isBiometrySelected,
  } = useGetStoredAuthValues()

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const handleAppUnlock = () => {
    if (keychainPin === pin) {
      dispatch(unlockApp())
    } else {
      setHasError(true)
    }
  }

  const handleBiometryAuthentication = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
      })
      dispatch(unlockApp())
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      } else if (err.name === 'UserFallback') {
        isBiometrySelected.current = false
      }
    }
  }

  const handleModalShow = async () => {
    if (isBiometrySelected.current) {
      await handleBiometryAuthentication()
    }
  }

  return (
    <Modal isVisible onShow={handleModalShow}>
      <ScreenContainer
        customStyles={{ marginTop: '30%', justifyContent: 'flex-start' }}
      >
        {isLoadingStorage ? (
          <ActivityIndicator />
        ) : (
          <>
            <Header>{strings.ENTER_YOUR_PIN}</Header>
            <View style={styles.inputContainer}>
              <PasscodeInput
                value={pin}
                stateUpdaterFn={setPin}
                onSubmit={handleAppUnlock}
                hasError={hasError}
                errorStateUpdaterFn={setHasError}
              />
            </View>
            <AbsoluteBottom>
              <Btn type={BtnTypes.secondary} onPress={() => {}}>
                {strings.FORGOT_YOUR_PIN}
              </Btn>
            </AbsoluteBottom>
          </>
        )}
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
  const isAuthSet = useSelector(isLocalAuthSet)
  const dispatch = useDispatch()

  useAppState((appState: AppStateStatus, nextAppState: AppStateStatus) => {
    if (
      (Platform.OS === 'ios' &&
        appState.match(/inactive|active/) &&
        nextAppState.match(/background/)) ||
      (Platform.OS === 'android' &&
        appState.match(/inactive|background/) &&
        nextAppState.match(/active/))
    ) {
      dispatch(lockApp())
    }

    appState = nextAppState
  })

  if (isLocked && isAuthSet && isLoggedIn) {
    return <Lock />
  }
  return null
}
