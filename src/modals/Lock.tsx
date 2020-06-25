import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  AppState,
  AppStateStatus,
  View,
  StyleSheet,
  ActivityIndicator,
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
import Paragraph, { ParagraphSizes } from '../components/Paragraph'
import BiometryAnimation from '../components/BiometryAnimation'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { getBiometryDescription } from '~/screens/DeviceAuthentication/utils/getText'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import { Colors } from '~/utils/colors'
import useGetStoredAuthValues from '~/hooks/useGetStoredAuthValues'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const dispatch = useDispatch()
  const {
    isLoadingStorage,
    biometryType,
    keychainPin,
    isBiometryShown,
    setIsBiometryShow,
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
        setIsBiometryShow(false)
      }
    }
  }

  // without additional tapping user can scan a finger on mount
  useEffect(() => {
    if (isBiometryShown) {
      handleBiometryAuthentication()
    }
  }, [isBiometryShown])

  const showPin = () => {
    setIsBiometryShow(false)
  }

  return (
    <Modal isVisible>
      <ScreenContainer
        customStyles={{ marginTop: '30%', justifyContent: 'flex-start' }}
      >
        {isLoadingStorage ? (
          <ActivityIndicator />
        ) : isBiometryShown ? (
          <>
            <Paragraph size={ParagraphSizes.large}>
              {strings.UNLOCK_WITH_BIOMETRY}
            </Paragraph>
            <BiometryAnimation
              biometryType={biometryType}
              handleAuthenticate={handleBiometryAuthentication}
              customStyles={{ marginTop: '20%' }}
            />
            <Paragraph color={Colors.success}>
              {strings.TAP_TO_ACTIVATE}
            </Paragraph>
            <AbsoluteBottom>
              <Btn type={BtnTypes.secondary} onPress={showPin}>
                {strings.I_WILL_USE_PIN_INSTEAD}
              </Btn>
            </AbsoluteBottom>
          </>
        ) : (
          <>
            <Paragraph size={ParagraphSizes.large}>
              {strings.ENTER_YOUR_PIN}
            </Paragraph>
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
  const [appState, setAppState] = useState(AppState.currentState)

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      dispatch(lockApp())
    }
    setAppState(nextAppState)
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
