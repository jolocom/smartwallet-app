import { TextInputProps, ViewStyle } from 'react-native'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
  containerStyle?: ViewStyle
  isValid?: boolean
  withHighlight?: boolean
}

export interface ITextAreaInputProps extends IInput {
  limit?: number
}

export enum InputValidityState {
  none = 'none',
  error = 'error',
  valid = 'valid',
}

export interface IInputUnderline extends IInput {
  validation?: RegExp
  onValidation?: (state: InputValidityState) => void
}
