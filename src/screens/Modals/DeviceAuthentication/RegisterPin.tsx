import React, { useState, useCallback } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Keychain from 'react-native-keychain'

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
import { useToasts } from '~/hooks/toasts'

const SCREEN_HEIGHT = Dimensions.get('window').height

const RegisterPin = () => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [selectedPasscode, setSelectedPasscode] = useState('')

  const handleRedirectToLoggedIn = useRedirectToLoggedIn()

  const { biometryType } = useDeviceAuthState()
  const dispatchToLocalAuth = useDeviceAuthDispatch()

  const displaySuccessLoader = useSuccess()
  const { scheduleWarning } = useToasts()

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
        displaySuccessLoader(redirectTo)
      } catch (err) {
        // an error with storing PIN to the keychain -> redirect back to create passcode
        scheduleWarning({
          title: 'Try again',
          message: 'We could not store your passcode. Please try again',
        })
        resetPasscode()
      }
    } else {
      throw new Error("Pins don't match")
    }
  }

  const resetPasscode = () => {
    setIsCreating(true)
    setSelectedPasscode('')
  }

  const { keyboardHeight } = useKeyboardHeight(0)

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: BP({ default: 36, small: 28, xsmall: 24 }),
      }}
    >
      <Passcode
        onSubmit={
          isCreating ? handlePasscodeSubmit : handleVerifiedPasscodeSubmit
        }
      >
        <Passcode.Container>
          <ScreenHeader
            title={
              isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE
            }
            subtitle={
              isCreating
                ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
                : strings.ADDING_AN_EXTRA_LAYER_OF_SECURITY
            }
          />
          <View style={styles.passcodeContainer}>
            <Passcode.Input />
          </View>
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.middle}
            color={Colors.success}
            customStyles={{
              marginTop: 20,
              opacity: isCreating ? 1 : 0,
            }}
          >
            {' '}
            {strings.YOU_CAN_CHANGE_THE_PASSCODE}
          </JoloText>
        </Passcode.Container>
        <Passcode.Container
          customStyles={{ justifyContent: 'flex-end', paddingBottom: 20 }}
        >
          {!isCreating && (
            <Btn type={BtnTypes.secondary} onPress={resetPasscode}>
              {strings.RESET}
            </Btn>
          )}
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
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
