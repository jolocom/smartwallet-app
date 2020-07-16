import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, KeyboardAvoidingView } from 'react-native'
import Keychain from 'react-native-keychain'

import Header, { HeaderSizes } from '~/components/Header'
import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
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

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
        }}
      >
        <View>
          <Header color={Colors.white90}>
            {isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
          </Header>
          <Paragraph
            color={Colors.white70}
            size={ParagraphSizes.medium}
            customStyles={{ marginHorizontal: 5, opacity: 0.8 }}
          >
            {isCreating
              ? strings.IN_ORDER_TO_PROTECT_YOUR_DATA
              : strings.YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN}
          </Paragraph>
        </View>
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
          <Paragraph
            size={ParagraphSizes.medium}
            color={Colors.success}
            customStyles={{ marginTop: 20 }}
          >
            {strings.ANY_FUTURE_PASSCODE_RESTORE}
          </Paragraph>
        )}
        {hasError && (
          <Paragraph color={Colors.error} customStyles={{ marginTop: 20 }}>
            {strings.PINS_DONT_MATCH}
          </Paragraph>
        )}
        {!isCreating && (
          <AbsoluteBottom customStyles={styles.btn}>
            <Btn type={BtnTypes.secondary} onPress={resetPasscode}>
              {strings.RESET}
            </Btn>
          </AbsoluteBottom>
        )}
      </ScreenContainer>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  passcodeContainer: {
    marginTop: BP({
      large: '30%',
      medium: '30%',
      small: '10%',
    }),
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    left: '38%',
    top: 100,
  },
  btn: {
    bottom: 0,
  },
})

export default Passcode
