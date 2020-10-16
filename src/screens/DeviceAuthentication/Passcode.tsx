import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import Keychain from 'react-native-keychain'

import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import Btn, { BtnTypes } from '~/components/Btn'
import useSuccess from '~/hooks/useSuccess'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import { PIN_USERNAME, PIN_SERVICE } from '~/utils/keychainConsts'

import {
  useDeviceAuthState,
  useDeviceAuthDispatch,
} from './module/deviceAuthContext'
import { showBiometry } from './module/deviceAuthActions'
import BP from '~/utils/breakpoints'
import { useRedirectToLoggedIn } from './useRedirectToLoggedIn'
import ScreenHeader from '~/components/ScreenHeader'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useBackHandler } from '@react-native-community/hooks'
import { useKeyboardHeight } from '~/hooks/useKeyboardHeight'

const SCREEN_HEIGHT = Dimensions.get('window').height

const Passcode = () => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')
  const [hasError, setHasError] = useState(false) // to indicate if verifiedPasscode doesn't match passcode

  const { biometryType } = useDeviceAuthState()
  const dispatchToLocalAuth = useDeviceAuthDispatch()

  const handleRedirectToLoggedIn = useRedirectToLoggedIn()

  const displaySuccessLoader = useSuccess()

  const handlePasscodeSubmit = useCallback(() => {
    setIsCreating(false)
  }, [])

  const redirectTo = () => {
    if (biometryType && biometryType !== 'IRIS') {
      dispatchToLocalAuth(showBiometry())
    } else {
      handleRedirectToLoggedIn()
    }
  }

  const handleVerifiedPasscodeSubmit = async () => {
    if (passcode === verifiedPasscode) {
      try {
        // setting up pin in the keychain
        await Keychain.setGenericPassword(PIN_USERNAME, passcode, {
          service: PIN_SERVICE,
          storage: Keychain.STORAGE_TYPE.AES,
        })
        displaySuccessLoader()
      } catch (err) {
        console.log({ err })
      }
      // redirect to Biometry screen if biometry is supported on a device, otherwise, redirect to LoggedIn section
      redirectTo()
    } else {
      setHasError(true)
    }
  }

  const resetPasscode = () => {
    setIsCreating(true)
    setPasscode('')
    setVerifiedPasscode('')
    setHasError(false)
  }

  useEffect(() => {
    if (verifiedPasscode.length < 4 && hasError) {
      setHasError(false)
    }
  }, [verifiedPasscode])

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
        {isCreating ? (
          <PasscodeInput
            value={passcode}
            stateUpdaterFn={setPasscode}
            onSubmit={handlePasscodeSubmit}
          />
        ) : (
          <PasscodeInput
            value={verifiedPasscode}
            stateUpdaterFn={setVerifiedPasscode}
            onSubmit={handleVerifiedPasscodeSubmit}
            errorStateUpdaterFn={setHasError}
            hasError={hasError}
          />
        )}
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
      {hasError && (
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.middle}
          color={Colors.error}
          customStyles={{ marginTop: 20 }}
        >
          {strings.PINS_DONT_MATCH}
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

export default Passcode
