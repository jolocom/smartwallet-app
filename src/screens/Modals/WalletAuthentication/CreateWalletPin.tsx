import React, { useState, useCallback, useEffect } from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'

import ScreenContainer from '~/components/ScreenContainer'
import { useSuccess } from '~/hooks/loader'
import { Colors } from '~/utils/colors'
import { SecureStorageKeys, useSecureStorage } from '~/hooks/secureStorage'

import BP from '~/utils/breakpoints'
import ScreenHeader from '~/components/ScreenHeader'
import JoloText, { JoloTextKind } from '~/components/JoloText'
import { JoloTextSizes } from '~/utils/fonts'
import { useRedirectToLoggedIn } from '~/hooks/navigation'
import {
  useWalletAuthDispatch,
  useWalletAuthState,
} from './module/walletAuthContext'
import { showBiometry } from './module/walletAuthActions'
import Passcode from '~/components/Passcode'
import { useToasts } from '~/hooks/toasts'
import { useResetKeychainValues } from '~/hooks/deviceAuth'
import useTranslation from '~/hooks/useTranslation'
import { promisifySubmit } from '~/components/Passcode/utils'

const SCREEN_HEIGHT = Dimensions.get('window').height

const CreateWalletPin = () => {
  const { t } = useTranslation()
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [selectedPasscode, setSelectedPasscode] = useState('')
  const [shouldResetPasscode, setShouldResetPasscode] = useState(false)

  const handleRedirectToLoggedIn = useRedirectToLoggedIn()
  const resetKeychainPasscode = useResetKeychainValues()

  const { biometryType } = useWalletAuthState()
  const dispatchToLocalAuth = useWalletAuthDispatch()

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
    resetKeychainPasscode().catch(scheduleErrorWarning)
  }, [])

  useEffect(() => {
    if (!selectedPasscode) {
      setShouldResetPasscode(false)
    }
  }, [selectedPasscode])

  const promisifyPasscodeSubmit = promisifySubmit((pin) => {
    setSelectedPasscode(pin)
    setIsCreating(false)
  })
  const handlePasscodeSubmit = useCallback(async (pin, cb) => {
    await promisifyPasscodeSubmit(pin, cb)
  }, [])

  const redirectTo = () => {
    if (biometryType) {
      dispatchToLocalAuth(showBiometry())
    } else {
      handleRedirectToLoggedIn()
    }
  }

  const handleVerifiedPasscodeSubmit = async (pin: string, cb: () => void) => {
    if (selectedPasscode === pin) {
      try {
        await secureStorage.setItem(
          SecureStorageKeys.passcode,
          selectedPasscode,
        )
        displaySuccessLoader(redirectTo)
        cb()
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
    setShouldResetPasscode(true)
    setSelectedPasscode('')
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: BP({ default: 36, small: 28, xsmall: 24 }),
      }}
      backgroundColor={Colors.bastille}
    >
      <Passcode
        onSubmit={
          isCreating ? handlePasscodeSubmit : handleVerifiedPasscodeSubmit
        }
        reset={shouldResetPasscode}
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
          {!isCreating && (
            <Passcode.ExtraAction onPress={resetPasscode}>
              {t('VerifyPasscode.resetBtn')}
            </Passcode.ExtraAction>
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

export default CreateWalletPin
