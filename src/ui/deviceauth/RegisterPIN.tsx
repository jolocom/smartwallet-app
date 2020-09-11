import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, BackHandler } from 'react-native'
import * as Keychain from 'react-native-keychain'

import I18n from 'src/locales/i18n'

import Header from './components/Header'
import Paragraph, { ParagraphSizes } from './components/Paragraph'
import AbsoluteBottom from './components/AbsoluteBottom'
import Btn, { BtnTypes } from './components/Btn'
import ScreenContainer from './components/ScreenContainer'
import PasscodeInput from './PasscodeInput'
import strings from '../../locales/strings'
import { PIN_USERNAME, PIN_SERVICE } from './utils/keychainConsts'
import { BP } from 'src/styles/breakpoints'

import { Colors } from './colors'
import { connect } from 'react-redux'
import { ThunkDispatch } from 'src/store'
import { genericActions } from 'src/actions'
import useKeyboardHeight from './hooks/useKeyboardHeight'
import { NavigationInjectedProps } from 'react-navigation'

interface PropsI extends
  NavigationInjectedProps,
  ReturnType<typeof mapDispatchToProps> {
}

const RegisterPIN: React.FC<PropsI> = ({
  unlockApplication,
  navigation
}) => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')
  const [hasError, setHasError] = useState(false) // to indicate if verifiedPasscode doesn't match passcode

  useEffect(() => {
    // don't let react-navigation handle this back button press if we are
    // focused
    const handleBack = () => navigation.isFocused()
    BackHandler.addEventListener('hardwareBackPress', handleBack)
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBack)
    }
  }, [])

  const { keyboardHeight } = useKeyboardHeight()

  const handlePasscodeSubmit = useCallback(() => {
    setIsCreating(false)
  }, [])

  const handleVerifiedPasscodeSubmit = async () => {
    if (passcode === verifiedPasscode) {
      try {
        // setting up pin in the keychain
        await Keychain.setGenericPassword(PIN_USERNAME, passcode, {
          service: PIN_SERVICE,
        })
      } catch (err) {
        console.log({ err })
      }
      unlockApplication(passcode)
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
      <ScreenContainer
        customStyles={{
          justifyContent: 'flex-start',
        }}>
        <View>
          <Header color={Colors.white90}>
            {isCreating
              ? I18n.t(strings.CREATE_PASSCODE)
              : I18n.t(strings.VERIFY_PASSCODE)}
          </Header>
          <Paragraph
            color={Colors.white70}
            size={ParagraphSizes.medium}
            customStyles={{ marginHorizontal: 5, opacity: 0.8 }}>
            {isCreating
              ? I18n.t(strings.IN_ORDER_TO_PROTECT_YOUR_DATA)
              : I18n.t(strings.YOU_WONT_BE_ABLE_TO_EASILY_CHECK_IT_AGAIN)}
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
            customStyles={{ marginTop: 20 }}>
            {I18n.t(strings.ANY_FUTURE_PASSCODE_RESTORE)}
          </Paragraph>
        )}
        {hasError && (
          <Paragraph color={Colors.error} customStyles={{ marginTop: 20 }}>
            {I18n.t(strings.PINS_DONT_MATCH)}
          </Paragraph>
        )}
        {!isCreating && (
          <AbsoluteBottom customStyles={{ bottom: keyboardHeight }}>
            <Btn type={BtnTypes.secondary} onPress={resetPasscode}>
              {I18n.t(strings.RESET)}
            </Btn>
          </AbsoluteBottom>
        )}
      </ScreenContainer>
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
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  unlockApplication: (pin: string) => dispatch(genericActions.unlockApp(pin)),
})

export default connect(
  null,
  mapDispatchToProps,
)(RegisterPIN)
