import React, { useCallback, useEffect, useRef, useState } from 'react'
import { View, StyleSheet, Keyboard, TextInput } from 'react-native'
import { useBackHandler } from '@react-native-community/hooks'
import { useIsFocused, useNavigation } from '@react-navigation/native'

import { strings } from '~/translations/strings'

import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import Btn, { BtnTypes } from '~/components/Btn'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import JoloText, { JoloTextKind, JoloTextWeight } from '~/components/JoloText'

import { useKeyboard } from '~/screens/Modals/Recovery/useKeyboard'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { useRedirectTo } from '~/hooks/navigation'

import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'

import { ScreenNames } from '~/types/screens'
import FingerprintScanner from 'react-native-fingerprint-scanner'
import { handleNotEnrolled } from '~/utils/biometryErrors'
import { getBiometryDescription } from './DeviceAuthentication/utils/getText'

const Lock = () => {
  const [pin, setPin] = useState('')
  const [hasError, setHasError] = useState(false)

  const {
    biometryType,
    keychainPin,
    isBiometrySelected,
  } = useGetStoredAuthValues()

  const { keyboardHeight } = useKeyboard()

  const navigation = useNavigation()

  const redirectToPinRecoveryInstruction = useRedirectTo(
    ScreenNames.PinRecoveryInstructions,
  )

  const unlockApp = useCallback(() => {
    navigation.goBack()
  }, [])

  /* START -> This is for showing and hiding keyboard when we move away from Lock screen */
  const pinInputRef = useRef<TextInput>(null)
  const isFocused = useIsFocused()

  useEffect(() => {
    if (!isFocused) {
      Keyboard.dismiss()
    } else {
      pinInputRef.current?.focus()
    }
  }, [isFocused])
  /* END -> This is for showing and hiding keyboard when we move away from Lock screen */

  /* START -> Biometry authentication if applicatble */
  const handleBiometryAuthentication = async () => {
    try {
      await FingerprintScanner.authenticate({
        description: getBiometryDescription(biometryType),
      })
      unlockApp()
    } catch (err) {
      if (err.name === 'FingerprintScannerNotEnrolled') {
        handleNotEnrolled(biometryType)
      }
    }
  }

  useEffect(() => {
    const initialBiometry = async () => {
      if (isFocused && isBiometrySelected) {
        await handleBiometryAuthentication()
      }
    }
    initialBiometry()
  }, [isFocused, isBiometrySelected])
  /* START -> Biometry authentication if applicatble */

  /* disable hardwareback button default functionality */
  useBackHandler(() => true)

  useEffect(() => {
    if (pin.length < 4 && hasError) {
      setHasError(false)
    }
  }, [pin])

  const handlePINSubmit = () => {
    if (keychainPin.toString() === pin) {
      unlockApp()
    } else {
      setHasError(true)
    }
  }

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
          ref={pinInputRef}
        />
      </View>
      <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
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
