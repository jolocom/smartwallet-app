import React, { useState } from 'react'

import ScreenContainer from '~/components/ScreenContainer'

import { sleep } from '~/utils/generic'

import { useGetStoredAuthValues } from '~/hooks/deviceAuth'
import { useGoBack, useRedirect } from '~/hooks/navigation'
import Passcode from '~/components/Passcode'
import { useLoader } from '~/hooks/loader'
import { useEffect } from 'react'
import useTranslation from '~/hooks/useTranslation'
import { useToasts } from '~/hooks/toasts'
import { SecureStorageKeys, useSecureStorage } from '~/hooks/secureStorage'
import { promisifySubmit } from '~/components/Passcode/utils'
import { ScreenNames } from '~/types/screens'
import { IPasscodeContext } from '~/components/Passcode/types'

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
  const redirect = useRedirect()

  const [passcodeState, setPasscodeState] = useState<PasscodeState>(
    PasscodeState.verify,
  )
  const [newPin, setNewPin] = useState('')
  const [errorTitle, setErrorTitle] = useState('')

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

  const promisifyCreateNewPin = promisifySubmit((pin) => {
    if (keychainPin && pin !== keychainPin) {
      setNewPin(pin)
      handleStateChange(PasscodeState.repeat)
    } else {
      setErrorTitle(t('ChangePasscode.sameCodeHeader'))
      throw new Error()
    }
  })
  const handleCreateNewPin = promisifyCreateNewPin

  const handleSubmit = async (pin: string, cb: () => void) => {
    switch (passcodeState) {
      case PasscodeState.verify:
        if (pin === keychainPin) {
          await handleStateChange(PasscodeState.create)
          cb()
        } else {
          setErrorTitle(t('ChangePasscode.wrongCodeHeader'))
          throw new Error("Pins don't match")
        }
        break
      case PasscodeState.create:
        await handleCreateNewPin(pin, cb)
        break
      case PasscodeState.repeat:
        if (pin === newPin) {
          await submitNewPin()
          cb()
        } else throw new Error("Pins don't match")
        break
      default:
        console.warn(
          `Warning: passcode state ${passcodeState} is not supported`,
        )
        break
    }
  }

  const handleExtraAction = ({ setPin }: IPasscodeContext) => {
    switch (passcodeState) {
      case PasscodeState.verify:
        redirect(ScreenNames.PinRecoveryInstructions)
        return
      case PasscodeState.create:
        return
      case PasscodeState.repeat:
        setPin('')
        setPasscodeState(PasscodeState.create)
        return
      default:
        console.warn(
          `Warning: passcode state ${passcodeState} is not supported`,
        )
        break
    }
  }
  const getExtraActionTitle = () => {
    switch (passcodeState) {
      case PasscodeState.verify:
        return t('Lock.forgotBtn')
      case PasscodeState.repeat:
        return t('VerifyPasscode.resetBtn')
      default:
        return undefined
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
        <Passcode.Container customStyles={{ justifyContent: 'flex-end' }}>
          <Passcode.ExtraAction onPress={handleExtraAction}>
            {getExtraActionTitle()}
          </Passcode.ExtraAction>
          <Passcode.Keyboard />
        </Passcode.Container>
      </Passcode>
    </ScreenContainer>
  )
}

export default ChangePin
