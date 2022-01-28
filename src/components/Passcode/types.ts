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

interface ExtraActionProps {
  onPress?: (context: IPasscodeContext) => void
  title?: string
}

export interface IPasscodeComposition {
  Input: React.FC
  Header: React.FC<IPasscodeHeaderProps>
  ExtraAction: React.FC<ExtraActionProps>
  Keyboard: React.FC<IPasscodeKeyboardProps>
  Container: React.FC<IWithCustomStyle>
  Error: React.FC
  Disable: React.FC
}

export interface IPasscodeContext {
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  setPinError: React.Dispatch<SetStateAction<boolean>>
  pinSuccess: boolean
  pinErrorText: string | null
  setPinErrorText: React.Dispatch<SetStateAction<string | null>>
}
