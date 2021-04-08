import { SetStateAction } from 'react'
import { IWithCustomStyle } from '../Card/types'

export interface IPasscodeProps {
  onSubmit: (passcode: string) => void | Promise<void>
}

export interface IPasscodeHeaderProps {
  title: string
  errorTitle: string
}

export interface IPasscodeComposition {
  Input: React.FC
  Header: React.FC<IPasscodeHeaderProps>
  Forgot: React.FC
  Keyboard: React.FC
  Container: React.FC<IWithCustomStyle>
}

export interface IPasscodeContext {
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  pinSuccess: boolean
}
