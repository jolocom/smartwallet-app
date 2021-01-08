import React, { useState, useCallback } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Keychain from 'react-native-keychain'
import { useBackHandler } from '@react-native-community/hooks'

import ScreenContainer from '~/components/ScreenContainer'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import Btn, { BtnTypes } from '~/components/Btn'
import { useSuccess } from '~/hooks/loader'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { PIN_USERNAME, PIN_SERVICE } from '~/utils/keychainConsts'

import BP from '~/utils/breakpoints'
import ScreenHeader from '~/components/ScreenHeader'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useRedirectToLoggedIn } from '~/hooks/navigation'
import {
  useDeviceAuthDispatch,
  useDeviceAuthState,
} from './module/deviceAuthContext'
import { showBiometry } from './module/deviceAuthActions'
import { useKeyboardHeight } from '~/hooks/useKeyboardHeight'
import Passcode from '~/components/Passcode'

const SCREEN_HEIGHT = Dimensions.get('window').height

const RegisterPin = () => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [selectedPasscode, setSelectedPasscode] = useState('')

  const handleRedirectToLoggedIn = useRedirectToLoggedIn()

  const { biometryType } = useDeviceAuthState()
  const dispatchToLocalAuth = useDeviceAuthDispatch()

  const displaySuccessLoader = useSuccess()

  const handlePasscodeSubmit = useCallback((pin) => {
    setSelectedPasscode(pin)
    setIsCreating(false)
  }, [])

  const redirectTo = () => {
    if (biometryType) {
      dispatchToLocalAuth(showBiometry())
    } else {
      handleRedirectToLoggedIn()
    }
  }

  const handleVerifiedPasscodeSubmit = async (pin: string) => {
    if (selectedPasscode === pin) {
      try {
        // setting up pin in the keychain
        await Keychain.setGenericPassword(PIN_USERNAME, selectedPasscode, {
          service: PIN_SERVICE,
          storage: Keychain.STORAGE_TYPE.AES,
        })
        displaySuccessLoader()
      } catch (err) {
        console.log({ err })
      }
      redirectTo()
    } else {
      throw new Error("Pins don't match")
    }
  }

  const resetPasscode = () => {
    setIsCreating(true)
    setSelectedPasscode('')
  }

  useBackHandler(() => true)

  const { keyboardHeight } = useKeyboardHeight(0)

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
    >
      <ScreenHeader
        title={isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
        subtitle={
          isCreating
            ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
            : strings.ADDING_AN_EXTRA_LAYER_OF_SECURITY
        }
      />
      <View style={styles.passcodeContainer}>
        <Passcode
          onSubmit={
            isCreating ? handlePasscodeSubmit : handleVerifiedPasscodeSubmit
          }
        >
          <Passcode.Input />
        </Passcode>
      </View>
      {isCreating && (
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.middle}
          color={Colors.success}
          customStyles={{ marginTop: 20 }}
        >
          {' '}
          {strings.YOU_CAN_CHANGE_THE_PASSCODE}
        </JoloText>
      )}
      {!isCreating && (
        <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
          <Btn type={BtnTypes.secondary} onPress={resetPasscode}>
            {strings.RESET}
          </Btn>
        </AbsoluteBottom>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  passcodeContainer: {
    marginTop: BP({ default: 0.1, xsmall: 0.05 }) * SCREEN_HEIGHT,
    position: 'relative',
  },
})

export default RegisterPin
