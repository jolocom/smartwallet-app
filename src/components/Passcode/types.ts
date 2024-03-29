import React, { SetStateAction } from 'react'
import { BiometryType } from 'react-native-biometrics'
import { IWithCustomStyle } from '~/types/props'
import { Colors } from '~/utils/colors'
import { IJoloTextProps } from '../JoloText'

export interface IPasscodeProps {
  onSubmit: (passcode: string, cb: () => void) => Promise<void>
  length?: number
  reset?: boolean
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
  numberOfLines?: number
}

export interface ExtraActionProps {
  onPress?: (context: IPasscodeContext) => void
  title?: string
}

export interface IPasscodeComposition {
  Input: React.FC<IPasscodeInputProps>
  Header: React.FC<IPasscodeHeaderProps>
  ExtraAction: React.FC<ExtraActionProps>
  Keyboard: React.FC<IPasscodeKeyboardProps>
  Container: React.FC<IWithCustomStyle>
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
