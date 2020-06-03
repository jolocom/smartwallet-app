import React, { useState, useCallback, useEffect } from 'react'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import Keychain from 'react-native-keychain'

import Header, { HeaderSizes } from '~/components/Header'
import ScreenContainer from '~/components/ScreenContainer'
import PasscodeInput from '~/components/PasscodeInput'
import { strings } from '~/translations/strings'
import { Colors } from '~/utils/colors'
import Paragraph from '~/components/Paragraph'
import useDelay from '~/hooks/useDelay'
import { useDeviceAuthState } from './module/context'
import useRedirectTo from '~/hooks/useRedirectTo'
import { ScreenNames } from '~/types/screens'
import useResetKeychainValues from '~/hooks/useResetKeychainValues'
import useSuccess from '~/hooks/useSuccess'

const PIN_SERVICE = 'com.jolocom.wallet-PIN'
const PIN_USERNAME = 'wallet-user'

const Passcode = () => {
  const [isCreating, setIsCreating] = useState(true) // to display create passcode or verify passcode
  const [passcode, setPasscode] = useState('')
  const [verifiedPasscode, setVerifiedPasscode] = useState('')
  const [showLoading, setShowLoading] = useState(false) // to immitate loading after passcode was submit and before redirecting to verifies passcode
  const [hasError, setHasError] = useState(false) // to indicate if verifiedPasscode doesn't match passcode

  const biometryType = useDeviceAuthState()
  const redirectToLoggedIn = useRedirectTo(ScreenNames.LoggedIn)
  const redirectToBiometry = useRedirectTo(ScreenNames.Biometry)
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const displaySuccessLoader = useSuccess()

  // 🧨🧨🧨🧨🧨
  // this is only for testing purposes !!! should be removed later on
  // this will delete credentials associated with a service name
  useEffect(() => {
    resetServiceValuesInKeychain()
  }, [])
  // 🧨🧨🧨🧨🧨

  const showVerification = () => {
    setIsCreating(false)
    setShowLoading(false)
  }

  const handlePasscodeSubmit = useCallback(async () => {
    setShowLoading(true)
    await useDelay(showVerification, 1000)
  }, [])

  const redirectTo = () => {
    if (biometryType && biometryType !== 'IRIS') {
      redirectToBiometry()
    } else {
      redirectToLoggedIn()
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
        await displaySuccessLoader()
      } catch (err) {
        console.log({ err })
      }
      // redirect to Biometry screen if biometry is supported on a device, otherwise, redirect to LoggedIn section

      redirectTo()
    } else {
      setHasError(true)
    }
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
        paddingTop: 30,
      }}
    >
      <View>
        <Header size={HeaderSizes.small} color={Colors.white90}>
          {isCreating ? strings.CREATE_PASSCODE : strings.VERIFY_PASSCODE}
        </Header>
        <Paragraph
          color={Colors.white70}
          customStyles={{ marginHorizontal: 10 }}
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
            hasError={hasError}
          />
        )}
      </View>
      {showLoading && (
        <ActivityIndicator testID="loading-indicator" style={styles.spinner} />
      )}
      {hasError && (
        <Paragraph color={Colors.error} customStyles={{ marginTop: 20 }}>
          {strings.PINS_DONT_MATCH}
        </Paragraph>
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  passcodeContainer: {
    marginTop: '30%',
  },
  spinner: {
    marginTop: 20,
  },
})

export default Passcode
