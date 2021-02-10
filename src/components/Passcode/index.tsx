import React, { SetStateAction, useEffect, useMemo, useState } from 'react'
import { useCustomContext } from '~/hooks/context'
import PasscodeForgot from './PasscodeForgot'
import PasscodeHeader from './PasscodeHeader'
import PasscodeInput from './PasscodeInput'

export interface IPasscodeProps {
  onSubmit: (passcode: string) => void | Promise<void>
}

export interface IPasscodeHeaderProps {
  title: string
  errorTitle: string
}

interface IPasscodeComposition {
  Input: React.FC
  Header: React.FC<IPasscodeHeaderProps>
  Forgot: React.FC
}

interface IPasscodeContext {
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  pinSuccess: boolean
}

const PasscodeContext = React.createContext<IPasscodeContext>({
  pin: '',
  setPin: () => {},
  pinError: false,
  pinSuccess: false,
})
PasscodeContext.displayName = 'PasscodeContext'

export const usePasscode = useCustomContext(PasscodeContext)

const Passcode: React.FC<IPasscodeProps> & IPasscodeComposition = ({
  children,
  onSubmit,
}) => {
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [pinSuccess, setPinSuccess] = useState(false)

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

  // submit when full pin is provided
  useEffect(() => {
    if (pin.length === 4) {
      handleSubmit()
    }
  }, [pin])

  // this will remove the error after 1000 ms
  useEffect(() => {
    if (pinError) {
      setTimeout(() => {
        setPinError(false)
        setPin('')
      }, 1000)
    }
  }, [pinError])

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