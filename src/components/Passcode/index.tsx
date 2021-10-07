import React, { useEffect, useMemo, useState } from 'react'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import ResetBtn from './ResetBtn'
import { useIsFocused } from '@react-navigation/native'
import PasscodeError from './PasscodeError'
import PasscodeDisable from './PasscodeDisable'

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
  length = 4,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)
  const [pinErrorText, setPinErrorText] = useState<string | null>(null)

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setPinError(false)
      setPin('')
    }
  }, [isFocused])

  const handleSubmit = async () => {
    try {
      await onSubmit(pin, () => {
        setPinSuccess(true)
        setTimeout(() => {
          setPin('')
          setPinSuccess(false)
        }, 500)
      })
    } catch (e) {
      setPinError(true)
    }
  }

  // submit when full pin is provided
  useEffect(() => {
    ;(async () => {
      if (pin.length === length) {
        await handleSubmit()
        setPin('')
      }
    })()
  }, [pin])

  // this will remove the error after 1000 ms
  useEffect(() => {
    let id: number | undefined
    if (pinError) {
      id = setTimeout(() => {
        /**
         * NOTE at this point pinAttemptsLeft is still an old value,
         * therefore we compare with 1 not 0
         */
        setPinError(false)
        setPin('')
      }, 1000)
    }
    return () => {
      if (id) {
        clearTimeout(id)
      }
    }
  }, [pinError])

  const contextValue = useMemo(
    () => ({
      passcodeLength: length,
      pin,
      setPin,
      pinError,
      setPinError,
      pinSuccess,
      pinErrorText,
      setPinErrorText,
    }),
    [pin, setPin, pinError, pinSuccess],
  )

  return <PasscodeContext.Provider value={contextValue} children={children} />
}

Passcode.Input = PasscodeInput
Passcode.Header = PasscodeHeader
Passcode.Forgot = PasscodeForgot
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer
Passcode.ResetBtn = ResetBtn
Passcode.Error = PasscodeError
Passcode.Disable = PasscodeDisable

export default Passcode
