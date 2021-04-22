import React, { useState } from 'react'
import Keychain from 'react-native-keychain'
import { NavigationProp } from '@react-navigation/native'

import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts'
import { sleep } from '~/utils/generic'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { ScreenNames } from '~/types/screens'
import { useRedirectTo } from '~/hooks/navigation'
import Passcode from '~/components/Passcode'
import { useLoader } from '~/hooks/loader'

interface PropsI {
  onSuccessRedirectToScreen?: ScreenNames
  navigation: NavigationProp<{}>
}

enum PasscodeState {
  verify = 'verify',
  create = 'create',
  repeat = 'repeat',
}

const ChangePin: React.FC<PropsI> = ({
  onSuccessRedirectToScreen,
  navigation,
}) => {
  const loader = useLoader()
  const { keychainPin } = useGetStoredAuthValues()

  const [passcodeState, setPasscodeState] = useState<PasscodeState>(
    PasscodeState.verify,
  )
  const [newPin, setNewPin] = useState('')

  const headerTitle = () => {
    switch (passcodeState) {
      case PasscodeState.verify:
        return strings.CURRENT_PASSCODE
      case PasscodeState.create:
        return strings.CREATE_NEW_PASSCODE
      case PasscodeState.repeat:
        return strings.VERIFY_PASSCODE
    }
  }

  const submitNewPin = async () => {
    loader(
      async () => {
        await Keychain.setGenericPassword(PIN_USERNAME, newPin, {
          service: PIN_SERVICE,
          storage: Keychain.STORAGE_TYPE.AES,
        })
      },
      { success: strings.PASSCODE_CHANGED },
      (success) => {
        if (success) {
          if (onSuccessRedirectToScreen) {
            const redirectToScreen = useRedirectTo(onSuccessRedirectToScreen)
            redirectToScreen()
          } else {
            navigation.goBack()
          }
        } else {
          //TODO: possibility to show toast?
          setPasscodeState(PasscodeState.verify)
        }
      },
    )
  }

  const handleStateChange = (state: PasscodeState) => {
    sleep(500, () => {
      setPasscodeState(state)
    })
  }

  const handleSubmit = async (pin: string) => {
    switch (passcodeState) {
      case PasscodeState.verify:
        if (pin === keychainPin) {
          handleStateChange(PasscodeState.create)
        } else {
          throw new Error("Pins don't match")
        }
        break
      case PasscodeState.create:
        setNewPin(pin)
        handleStateChange(PasscodeState.repeat)
        break
      case PasscodeState.repeat:
        if (pin === newPin) {
          submitNewPin()
        } else throw new Error("Pins don't match")
        break
    }
  }

  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
      }}
      hasHeaderBack
    >
      <Passcode onSubmit={handleSubmit}>
        <Passcode.Container>
          <Passcode.Header
            title={headerTitle()}
            errorTitle={strings.WRONG_PASSCODE}
          />
          <Passcode.Input />
        </Passcode.Container>
        <Passcode.Container>
          <Passcode.Forgot />
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}

export default ChangePin
