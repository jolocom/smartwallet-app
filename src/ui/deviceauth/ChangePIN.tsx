import React, { useState } from 'react'
import * as Keychain from 'react-native-keychain'
import { ActivityIndicator } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'

import I18n from 'src/locales/i18n'

import PasscodeInput from './PasscodeInput'
import PasscodeHeader from './PasscodeHeader'

import { PIN_SERVICE, PIN_USERNAME } from './utils/keychainConsts'

import useResetKeychainValues from './hooks/useResetKeychainValues'
import useGetStoredAuthValues from './hooks/useGetStoredAuthValues'

import strings from '../../locales/strings'
import PasscodeWrapper from './components/PasscodeWrapper'
import { Wrapper } from '../structure'
import { NavigationSection } from '../errors/components/navigationSection'

interface PropsI {
  navigation: NavigationScreenProp<{}, {}>
}

const ChangePin: React.FC<PropsI> = ({ navigation }) => {
  const [pin, setPin] = useState('')
  const [newPin, setNewPin] = useState('')
  const [hasError, setHasError] = useState(false)
  const [isCreateNew, setIsCreateNew] = useState(false)

  const { keychainPin, isLoadingStorage } = useGetStoredAuthValues()

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
    <Wrapper dark>
      <NavigationSection
        isBackButton={false}
        onNavigation={() => navigation.goBack()}
      />
      <PasscodeWrapper>
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
      </PasscodeWrapper>
    </Wrapper>
  )
}

export default ChangePin
