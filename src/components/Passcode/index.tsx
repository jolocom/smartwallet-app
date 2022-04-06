import React, { useEffect, useMemo, useState } from 'react'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'
import { IPasscodeProps, IPasscodeComposition } from './types'
import { PasscodeContext } from './context'
import PasscodeKeyboard from './PasscodeKeyboard'
import PasscodeContainer from './PasscodeContainer'
import { useIsFocused } from '@react-navigation/native'
import PasscodeError from './PasscodeError'
import PasscodeExtraAction from './PasscodeExtraAction'
import PasscodeDisable from './PasscodeDisable'
import { useToasts } from '~/hooks/toasts'

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)
  const [pinErrorText, setPinErrorText] = useState<string | null>(null)

  const isFocused = useIsFocused()

  const { scheduleErrorWarning } = useToasts()

  useEffect(() => {
    if (isFocused) {
      setPinError(false)
      setPin('')
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

  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit()
        .then(() => {
          // FIXME resetting pin twice
          setPin('')
        })
        .catch(() => setPinError(true))
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
Passcode.ExtraAction = PasscodeExtraAction
Passcode.Keyboard = PasscodeKeyboard
Passcode.Container = PasscodeContainer
Passcode.Error = PasscodeError
Passcode.Disable = PasscodeDisable

export default Passcode
