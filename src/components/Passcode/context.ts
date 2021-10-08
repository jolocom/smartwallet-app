import React from 'react'
import { useCustomContext } from '~/hooks/context'
import { IPasscodeContext } from './types'

export const ALL_PIN_ATTEMPTS = 5

export const PasscodeContext = React.createContext<
  IPasscodeContext | undefined
>({
  pin: '',
  // eslint-disable-next-line
  setPin: () => {},
  pinError: false,
  setPinError: () => {},
  pinSuccess: false,
  pinErrorText: '',
  setPinErrorText: () => {},
  passcodeLength: 4,
})
PasscodeContext.displayName = 'PasscodeContext'

export const usePasscode = useCustomContext(PasscodeContext)
