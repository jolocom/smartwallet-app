import React, { useState } from 'react'
import Keychain from 'react-native-keychain'

import ScreenContainer from '~/components/ScreenContainer'

import { strings } from '~/translations/strings'
import { PIN_SERVICE, PIN_USERNAME } from '~/utils/keychainConsts'
import { sleep } from '~/utils/generic'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { useGoBack } from '~/hooks/navigation'
import Passcode from '~/components/Passcode'
import { useLoader } from '~/hooks/loader'
import { useEffect } from 'react'

enum PasscodeState {
  verify = 'verify',
  create = 'create',
  repeat = 'repeat',
}

const ChangePin: React.FC = () => {
  const loader = useLoader()
  const { keychainPin } = useGetStoredAuthValues()
  const goBack = useGoBack()

  const [passcodeState, setPasscodeState] = useState<PasscodeState>(
    PasscodeState.verify,
  )
  const [newPin, setNewPin] = useState('')
  const defaultError = strings.WRONG_PASSCODE
  const [errorTitle, setErrorTitle] = useState(defaultError)

  useEffect(() => {
    setErrorTitle(defaultError)
  }, [newPin])

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
      (error) => {
        if (error) {
          //TODO: possibility to show toast?
          setPasscodeState(PasscodeState.verify)
        } else {
          goBack()
        }
      },
    )
  }

  const handleStateChange = async (state: PasscodeState) => {
    await sleep(500, () => {
      setPasscodeState(state)
    })
  }

  const handleCreateNewPin = (pin: string) => {
    if (keychainPin && pin !== keychainPin) {
      setNewPin(pin)
      handleStateChange(PasscodeState.repeat)
    } else {
      setErrorTitle('The same as old')
      throw new Error()
    }
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
        handleCreateNewPin(pin)
        break
      case PasscodeState.repeat:
        if (pin === newPin) {
          await submitNewPin()
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
          <Passcode.Header title={headerTitle()} errorTitle={errorTitle} />
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
