import React, { useEffect, useState } from 'react'
import { View, StyleSheet, ActivityIndicator } from 'react-native'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import PasscodeInput from './PasscodeInput'
import ScreenContainer from './ScreenContainer'
import Header from './Header'
import LocalModal from './LocalModal'
import useGetStoredAuthValues from './hooks/useGetStoredAuthValues'
import { handleNotEnrolled } from './utils/biometryErrors'
import { getBiometryDescription } from './utils/getText'

import strings from '../../locales/strings'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

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
      // dispatch(unlockApp())
    } else {
      setHasError(true)
    }
  }

  const handleBiometryAuthentication = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
      })
      // dispatch(unlockApp())
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
    <LocalModal onShow={handleModalShow}>
      <ScreenContainer>
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
          </>
        )}
      </ScreenContainer>
    </LocalModal>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    // height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
})

export default Lock
