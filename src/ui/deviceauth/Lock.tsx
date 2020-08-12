import React, { useEffect, useState } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Dimensions,
} from 'react-native'
import FingerprintScanner from 'react-native-fingerprint-scanner'

import PasscodeInput from './PasscodeInput'
import { getBiometryDescription } from './utils/getText'
import { handleNotEnrolled } from './utils/biometryErrors'
import useGetStoredAuthValues from './hooks/useGetStoredAuthValues'
import { Colors } from './colors'

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
    <Modal
      animationType="fade"
      transparent={true}
      visible
      presentationStyle="overFullScreen"
      onShow={handleModalShow}
    >
      <View style={styles.container}>
        {isLoadingStorage ? (
          <ActivityIndicator />
        ) : (
          <>
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
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.mainBlack,
  },
  inputContainer: {
    height: Dimensions.get('window').height,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
})

export default Lock
