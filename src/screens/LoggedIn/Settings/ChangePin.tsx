import React, { useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'

import { sleep } from '~/utils/generic'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { useGoBack } from '~/hooks/navigation'
import Passcode from '~/components/Passcode'
import { useLoader } from '~/hooks/loader'
import { useEffect } from 'react'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '~/hooks/toasts'
import { SecureStorageKeys, useSecureStorage } from '~/hooks/secureStorage'

enum PasscodeState {
  verify = 'verify',
  create = 'create',
  repeat = 'repeat',
}

const ChangePin: React.FC = () => {
  const { t } = useTranslation()
  const loader = useLoader()
  const { keychainPin } = useGetStoredAuthValues()
  const goBack = useGoBack()
  const { scheduleErrorWarning } = useToasts()
  const secureStorage = useSecureStorage()

  const [passcodeState, setPasscodeState] = useState<PasscodeState>(
    PasscodeState.verify,
  )
  const [newPin, setNewPin] = useState('')
  const [errorTitle, setErrorTitle] = useState('')

  useEffect(() => {
    setErrorTitle(t('ChangePasscode.wrongCodeHeader'))
  }, [newPin])

  const headerTitle = () => {
    switch (passcodeState) {
      case PasscodeState.verify:
        return t('ChangePasscode.currentHeader')
      case PasscodeState.create:
        return t('CreatePasscode.createHeader')
      case PasscodeState.repeat:
        return t('VerifyPasscode.verifyHeader')
      default:
        console.warn('Warning: Wrong passcodeState in ChangePin!')
        return ''
    }
  }

  const submitNewPin = async () => {
    loader(
      async () => {
        await secureStorage.setItem(SecureStorageKeys.passcode, newPin)
      },
      { success: t('ChangePasscode.successHeader') },
      (error) => {
        if (error) {
          scheduleErrorWarning(error, {
            message: t('Toasts.failedStoreMsg'),
          })
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
      setErrorTitle(t('ChangePasscode.sameCodeHeader'))
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
      default:
        console.warn('Warning: Wrong passcodeState in ChangePin!')
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
