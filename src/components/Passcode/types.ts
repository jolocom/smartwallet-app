import React, { SetStateAction } from 'react'
import { BiometryType } from 'react-native-biometrics'
import { IWithCustomStyle } from '~/types/props'
import { Colors } from '~/utils/colors'
import { IJoloTextProps } from '../JoloText'

export interface IPasscodeProps {
  onSubmit: (passcode: string, cb: () => void) => Promise<void>
  length?: number
}

export interface IPasscodeHeaderProps extends IJoloTextProps {
  title: string
  errorTitle: string
}

export interface IPasscodeKeyboardProps {
  biometryType?: BiometryType
  onBiometryPress?: () => void
}

export interface IPasscodeInputProps {
  cellColor?: Colors
}

export interface IPasscodeComposition {
  Input: React.FC<IPasscodeInputProps>
  Header: React.FC<IPasscodeHeaderProps>
  Forgot: React.FC
  Keyboard: React.FC<IPasscodeKeyboardProps>
  Container: React.FC<IWithCustomStyle>
  ResetBtn: React.FC<{ onPress: () => void }>
  Error: React.FC
  Disable: React.FC
}

export interface IPasscodeContext {
  passcodeLength: number
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  setPinError: React.Dispatch<SetStateAction<boolean>>
  pinSuccess: boolean
  pinErrorText: string | null
  setPinErrorText: React.Dispatch<SetStateAction<string | null>>
}
