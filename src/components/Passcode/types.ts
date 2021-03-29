import { SetStateAction } from 'react'

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
  Container: React.FC
}

export interface IPasscodeContext {
  pin: string
  setPin: React.Dispatch<SetStateAction<string>>
  pinError: boolean
  pinSuccess: boolean
}
