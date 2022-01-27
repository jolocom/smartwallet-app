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
import { useDisableApp, useGetResetStoredCountdownValues } from './hooks'
import PasscodeExtraAction from './PasscodeExtraAction'

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const { pinAttemptsLeft } = useDisableApp(pinError, pinSuccess)
  const resetCountdownValues = useGetResetStoredCountdownValues()

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

  /**
   * clearing app stored value
   * upon successful submission of the pass code;
   * we don't want to reset values when the hardware
   * back button is pressed (this is another way how
   * the screen can be unmounted)
   */
  useEffect(
    () => () => {
      if (pinSuccess) {
        resetCountdownValues()
      }
    },
    [pinSuccess],
  )

  // submit when full pin is provided
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit()
    }
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
        if (pinAttemptsLeft > 1) {
          setPinError(false)
          setPin('')
        }
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
      pin,
      setPin,
      pinError,
      pinSuccess,
      pinAttemptsLeft,
    }),
    [pin, setPin, pinError, pinSuccess],
  )

  return <PasscodeContext.Provider value={contextValue} children={children} />
}

Passcode.Input = PasscodeInput
Passcode.Header = PasscodeHeader
Passcode.ExtraAction = PasscodeExtraAction
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer
Passcode.Error = PasscodeError

export default Passcode
