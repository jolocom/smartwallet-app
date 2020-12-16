import React, { useEffect, useMemo, useState } from 'react'
import { useCustomContext } from '~/hooks/context'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'

interface IPasscodeProps {
  onSubmit: (passcode: string) => Promise<void>
}

export interface IPasscodeHeaderProps {
  title: string
}

interface IPasscodeComposition {
  Input: React.FC
  Header: React.FC<IPasscodeHeaderProps>
  Forgot: React.FC
}

const PasscodeContext = React.createContext(undefined)
PasscodeContext.displayName = 'PasscodeContext'

export const usePasscode = useCustomContext(PasscodeContext)

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

  const handleSubmit = async () => {
    try {
      setPinSuccess(true)
      await onSubmit(pin)
      setTimeout(() => {
        setPin('')
        setPinSuccess(false)
      }, 1000)
    } catch (e) {
      setPinError(true)
    }
  }

  // this will remove the error after 1000 ms
  useEffect(() => {
    if (pinError) {
      setTimeout(() => {
        setPinError(false)
        setPin('')
        // pinInputRef.current?.focus()
      }, 1000)
    }
  }, [pinError])

  // submit when full pin is provided
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit()
    }
  }, [pin])

  const contextValue = useMemo(
    () => ({
      pin,
      setPin,
      pinError,
      pinSuccess,
    }),
    [pin, setPin, pinError, pinSuccess],
  )

  return <PasscodeContext.Provider value={contextValue} children={children} />
}

Passcode.Input = PasscodeInput
Passcode.Header = PasscodeHeader
Passcode.Forgot = PasscodeForgot

export default Passcode
