import React, { useState } from 'react'
import Keychain from 'react-native-keychain'
import { ActivityIndicator } from 'react-native'
import { NavigationProp } from '@react-navigation/native'
import { useDispatch } from 'react-redux'

import PasscodeHeader from '~/components/PasscodeHeader'
import PasscodeInput from '~/components/PasscodeInput'
import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts'

import {
  useResetKeychainValues,
  useGetStoredAuthValues,
} from '~/hooks/deviceAuth'
import { setLoader, dismissLoader } from '~/modules/loader/actions'
import { LoaderTypes } from '~/modules/loader/types'
import { useDelay } from '~/hooks/generic'
import { ScreenNames } from '~/types/screens'
import { useRedirectTo } from '~/hooks/navigation'

interface PropsI {
  onSuccessRedirectToScreen?: ScreenNames
  navigation: NavigationProp<{}>
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

  const dispatch = useDispatch()
  const resetServiceValuesInKeychain = useResetKeychainValues(PIN_SERVICE)

  const handlePinVerification = async () => {
    if (pin === keychainPin) {
      await useDelay(() => setIsCreateNew(true), 1000)
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
    dispatch(
      setLoader({
        type: LoaderTypes.success,
        msg: strings.PASSWORD_SUCCESSFULLY_CHANGED,
      }),
    )
    await useDelay(() => dispatch(dismissLoader()))
    if (onSuccessRedirectToScreen) {
      const redirectToScreen = useRedirectTo(onSuccessRedirectToScreen)
      redirectToScreen()
    } else {
      navigation.goBack()
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        marginTop: '30%',
        justifyContent: 'flex-start',
        paddingTop: 0,
      }}
      hasHeaderBack
    >
      <PasscodeHeader>
        {hasError
          ? strings.WRONG_PIN
          : isCreateNew
          ? strings.CREATE_NEW_PASSCODE
          : strings.CURRENT_PASSCODE}
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

export default ChangePin
