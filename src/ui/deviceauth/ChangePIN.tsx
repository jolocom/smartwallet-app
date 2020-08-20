import React, { useState, useEffect } from 'react'
import * as Keychain from 'react-native-keychain'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'

import I18n from 'src/locales/i18n'

import PasscodeInput from './PasscodeInput'
import PasscodeHeader from './PasscodeHeader'
import ScreenContainer from './components/ScreenContainer'

import { PIN_SERVICE, PIN_USERNAME } from './utils/keychainConsts'

import useResetKeychainValues from './hooks/useResetKeychainValues'
import useGetStoredAuthValues from './hooks/useGetStoredAuthValues'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { CloseIcon } from 'src/resources'

import strings from '../../locales/strings'
import { NavigationScreenProp } from 'react-navigation'

interface PropsI {
  navigation: NavigationScreenProp<{}, { isPINrecovery: boolean }>
}

const ChangePin: React.FC<PropsI> = ({ navigation }) => {
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isCreateNew, setIsCreateNew] = useState(false)

  const isPINrecovery = navigation.state.params?.isPINrecovery

  const { keychainPin, isLoadingStorage } = useGetStoredAuthValues()

  useEffect(() => {
    if (isPINrecovery && keychainPin) {
      setPin(keychainPin)
    }
  }, [isPINrecovery, keychainPin])

  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const handlePinVerification = async () => {
    if (pin === keychainPin) {
      setIsCreateNew(true)
    } else {
      setHasError(true)
    }
  }

  const handleSetNewPin = async () => {
    await resetServiceValuesInKeychain()
    await Keychain.setGenericPassword(PIN_USERNAME, newPin, {
      service: PIN_SERVICE,
    })
    navigation.goBack()
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        padding: 20,
      }}
    >
      {!isPINrecovery && (
        <View style={styles.header}>
          <TouchableOpacity
            style={{ padding: 10 }}
            onPress={e => navigation.goBack()}
          >
            <CloseIcon />
          </TouchableOpacity>
        </View>
      )}
      <PasscodeHeader>
        {hasError
          ? I18n.t(strings.WRONG_PIN)
          : isCreateNew
          ? I18n.t(strings.CREATE_NEW_PASSCODE)
          : I18n.t(strings.CURRENT_PASSCODE)}
      </PasscodeHeader>
      {isLoadingStorage ? (
        <ActivityIndicator />
      ) : isCreateNew ? (
        <PasscodeInput
          value={newPin}
          stateUpdaterFn={setNewPin}
          onSubmit={handleSetNewPin}
        />
      ) : (
        <PasscodeInput
          value={pin}
          stateUpdaterFn={setPin}
          errorStateUpdaterFn={setHasError}
          onSubmit={handlePinVerification}
          hasError={hasError}
        />
      )}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  header: {
    alignSelf: 'flex-end',
  },
})

export default ChangePin
