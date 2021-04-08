import { TextInputProps, ViewStyle } from 'react-native'
import { IWithCustomStyle } from '../Card/types'

export interface IInput extends TextInputProps, IWithCustomStyle {
  value: string
  updateInput: (val: string) => void
  containerStyle?: ViewStyle
  isValid?: boolean
  withHighlight?: boolean
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
