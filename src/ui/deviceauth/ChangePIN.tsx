import React, { useState } from 'react'
import Keychain from 'react-native-keychain'
import { ActivityIndicator, View, StyleSheet } from 'react-native'

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

interface PropsI {
  onSuccessRedirectToScreen?: any
  navigation: any
}

const ChangePin: React.FC<PropsI> = ({
  onSuccessRedirectToScreen,
  navigation,
}) => {
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isCreateNew, setIsCreateNew] = useState(false)

  const { keychainPin, isLoadingStorage } = useGetStoredAuthValues()

  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const handlePinVerification = async () => {
    if (pin === keychainPin) {
      setTimeout(() => {
        setIsCreateNew(true)
      }, 1000)
    } else {
      setHasError(true)
    }
  }

  const handleSetNewPin = async () => {
    resetServiceValuesInKeychain()
    await Keychain.setGenericPassword(PIN_USERNAME, newPin, {
      service: PIN_SERVICE,
      storage: Keychain.STORAGE_TYPE.AES,
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
      <View style={styles.header}>
        <TouchableOpacity style={{ padding: 10 }} onPress={navigation.goBack}>
          <CloseIcon />
        </TouchableOpacity>
      </View>
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
