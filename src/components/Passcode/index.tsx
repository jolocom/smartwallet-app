import React, { useEffect, useMemo, useState } from 'react'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { ALL_PIN_ATTEMPTS, PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import ResetBtn from './ResetBtn'
import { useIsFocused } from '@react-navigation/native'
import PasscodeError from './PasscodeError'
import {
  PIN_ATTEMPTS_CYCLES,
  useDisableApp,
  useGetStoreCountdownValues,
} from './hooks'

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const { pinAttemptsLeft } = useDisableApp(pinError, pinSuccess)
  const {
    storeLastCountdown,
    storePinNrAttemptCyclesLeft,
    storePinNrAttemptsLeft,
  } = useGetStoreCountdownValues()

  const isFocused = useIsFocused()

  useEffect(() => {
    if (isFocused) {
      setPinError(false)
      setPin('')
    }
  }, [isFocused])

  const handleSubmit = async () => {
    try {
      await onSubmit(pin)
      setPinSuccess(true)
      setTimeout(() => {
        setPin('')
        setPinSuccess(false)
      }, 500)
    } catch (e) {
      setPinError(true)
    }
  }

  /**
   * clearing app stored value
   * upon successful submission of the pass code
   */
  useEffect(
    () => () => {
      ;(async () => {
        await storeLastCountdown(0)
        await storePinNrAttemptCyclesLeft(PIN_ATTEMPTS_CYCLES)
        await storePinNrAttemptsLeft(ALL_PIN_ATTEMPTS)
      })()
    },
    [],
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
Passcode.Forgot = PasscodeForgot
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer
Passcode.ResetBtn = ResetBtn
Passcode.Error = PasscodeError

export default Passcode
