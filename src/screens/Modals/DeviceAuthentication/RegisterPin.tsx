import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import Btn, { BtnTypes } from '~/components/Btn'
import { useSuccess } from '~/hooks/loader'
import { Colors } from '~/utils/colors'
import { SecureStorageKeys, useSecureStorage } from '~/hooks/secureStorage'

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
import Passcode from '~/components/Passcode'
import { useToasts } from '~/hooks/toasts'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import useTranslation from '~/hooks/useTranslation'

const SCREEN_HEIGHT = Dimensions.get('window').height

const RegisterPin = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [selectedPasscode, setSelectedPasscode] = useState('')

  const handleRedirectToLoggedIn = useRedirectToLoggedIn()
  const resetKeychainPasscode = useResetKeychainValues()

  const { biometryType } = useDeviceAuthState()
  const dispatchToLocalAuth = useDeviceAuthDispatch()

  const displaySuccessLoader = useSuccess()
  const { scheduleErrorWarning } = useToasts()
  const secureStorage = useSecureStorage()

  /**
   * NOTE: a user does not have a possibility to remove the passcode from the keychain,
   * which leaves her with the passcode already being present when the app is being
   * reinstalled. The below will clean the keychain every time a user is on
   * the register pin screen.
   */
  useEffect(() => {
    resetKeychainPasscode()
  }, [])

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
        await secureStorage.setItem(
          SecureStorageKeys.passcode,
          selectedPasscode,
        )
        displaySuccessLoader(redirectTo)
      } catch (err) {
        // an error with storing PIN to the keychain -> redirect back to create passcode

        scheduleErrorWarning(err, {
          message: t('Toasts.failedStoreMsg'),
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
              isCreating
                ? t('CreatePasscode.createHeader')
                : t('VerifyPasscode.verifyHeader')
            }
            subtitle={
              isCreating
                ? t('CreatePasscode.createSubheader')
                : t('VerifyPasscode.verifySubheader')
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
            {t('CreatePasscode.helperText')}
          </JoloText>
        </Passcode.Container>
        <Passcode.Container
          customStyles={{ justifyContent: 'flex-end', paddingBottom: 20 }}
        >
          {!isCreating && <Passcode.ResetBtn onPress={resetPasscode} />}
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
