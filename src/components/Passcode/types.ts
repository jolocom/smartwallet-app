import React, { SetStateAction } from 'react'
import { BiometryType } from 'react-native-biometrics'
import { IWithCustomStyle } from '~/types/props'

export interface IPasscodeProps {
  onSubmit: (passcode: string, cb: () => void) => Promise<void>
}

export interface IPasscodeHeaderProps {
  title: string
  errorTitle: string
}

export interface IPasscodeKeyboardProps {
  biometryType?: BiometryType
  onBiometryPress?: () => void
}

export interface IPasscodeComposition {
  Input: React.FC
  Header: React.FC<IPasscodeHeaderProps>
  Forgot: React.FC
  Keyboard: React.FC<IPasscodeKeyboardProps>
  Container: React.FC<IWithCustomStyle>
  ResetBtn: React.FC<{ onPress: () => void }>
  Error: React.FC
}

export interface IPasscodeContext {
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  pinSuccess: boolean
  pinAttemptsLeft: number
}
