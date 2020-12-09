import { TextInputProps } from 'react-native'
import InputTextArea from './InputTextArea'

import InputUnderline from './InputUnderline'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
}

const InputBlock = () => {
  return null
}

const Input = () => {
  return null
}

Input.Block = InputBlock
Input.TextArea = InputTextArea
Input.Underline = InputUnderline

export default Input
