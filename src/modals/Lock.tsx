import React, { useCallback, useEffect, useState } from 'react'
import { View, StyleSheet } from 'react-native'

import { strings } from '~/translations/strings'

import ScreenContainer from '../components/ScreenContainer'
import PasscodeInput from '../components/PasscodeInput'
import Btn, { BtnTypes } from '../components/Btn'
import AbsoluteBottom from '../components/AbsoluteBottom'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { getBiometryDescription } from '~/screens/DeviceAuthentication/utils/getText'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import useGetStoredAuthValues from '~/hooks/useGetStoredAuthValues'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import { useNavigation } from '@react-navigation/native'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const navigation = useNavigation()
  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  const {
    biometryType,
    keychainPin,
    isBiometrySelected,
  } = useGetStoredAuthValues()

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const unlockApp = useCallback(() => {
    navigation.goBack()
  }, [])

  const handlePINSubmit = () => {
    if (keychainPin.toString() === pin) {
      unlockApp()
    } else {
      setHasError(true)
    }
  }

  const handleBiometryAuthentication = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
      })
      unlockApp()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      } else if (err.name === 'UserFallback') {
        isBiometrySelected.current = false
      }
    }
  }

  useEffect(() => {
    const handleBiometryAuth = async () => {
      if (isBiometrySelected.current) {
        await handleBiometryAuthentication()
      }
    }
    handleBiometryAuth()
  }, [])

  return (
    <ScreenContainer
      customStyles={{
        marginTop: '30%',
        justifyContent: 'flex-start',
      }}
    >
      <JoloText
        kind={JoloTextKind.title}
        size={JoloTextSizes.middle}
        weight={JoloTextWeight.regular}
        color={Colors.white90}
      >
        {strings.ENTER_YOUR_PIN}
      </JoloText>
      <View style={styles.inputContainer}>
        <PasscodeInput
          value={pin}
          stateUpdaterFn={setPin}
          onSubmit={handlePINSubmit}
          hasError={hasError}
          errorStateUpdaterFn={setHasError}
        />
      </View>
      <AbsoluteBottom>
        <Btn
          type={BtnTypes.secondary}
          onPress={redirectToPinRecoveryInstruction}
        >
          {strings.FORGOT_YOUR_PIN}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 20,
  },
})

export default Lock
