import React, { useEffect, useMemo, useState } from 'react'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import ResetBtn from './ResetBtn'
import PasscodeError from './PasscodeError'
import PasscodeDisable from './PasscodeDisable'
import PasscodeAccessoryBtn from './PasscodeAccessoryBtn'
import { useIsFocused } from '@react-navigation/core'

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
    if (!isFocused) {
      setPinErrorText(null)
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
  }, [pin, length])

  /**
   * reset the error text after starting
   * the process of re-entering pin
   */
  useEffect(() => {
    if (pin.length > 0) {
      setPinErrorText(null)
    }
  }, [pin])

  // this resets the error (colors cells) 1000 ms
  useEffect(() => {
    let id: number | undefined
    if (pinError) {
      id = setTimeout(() => {
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
    [pin, setPin, pinError, pinErrorText, pinSuccess, length],
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
Passcode.AccessoryBtn = PasscodeAccessoryBtn

export default Passcode
