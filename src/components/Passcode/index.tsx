import React, { useEffect, useMemo, useState } from 'react'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import PasscodeError from './PasscodeError'
import PasscodeDisable from './PasscodeDisable'
import PasscodeExtraAction from './PasscodeExtraAction'
import { useIsFocused } from '@react-navigation/native'

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  reset,
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
    reset && setPin('')
  }, [reset])

  useEffect(() => {
    if (!isFocused) {
      setPinErrorText(null)
    }
  }, [isFocused])

  const handleSubmit = async () => {
    return onSubmit(pin, () => {
      setPinSuccess(true)
      setTimeout(() => {
        setPin('')
        setPinSuccess(false)
      }, 500)
    })
  }

  // submit when full pin is provided
  useEffect(() => {
    if (pin.length === length) {
      handleSubmit()
        .then(() => {
          // FIXME resetting pin twice
          setPin('')
        })
        .catch(() => setPinError(true))
    }
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
Passcode.ExtraAction = PasscodeExtraAction
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer
Passcode.Error = PasscodeError
Passcode.Disable = PasscodeDisable

export default Passcode
