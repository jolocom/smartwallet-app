import React from 'react'
import { useCustomContext } from '~/hooks/context'
import { IPasscodeContext } from './types'

export const PasscodeContext = React.createContext<
  IPasscodeContext | undefined
>({
  pin: '',
  setPin: () => {},
  pinError: false,
  pinSuccess: false,
})
PasscodeContext.displayName = 'PasscodeContext'

export const usePasscode = useCustomContext(PasscodeContext)
