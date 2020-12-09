import React from 'react'
import { StyleSheet, TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from '~/utils/colors'
import { subtitleFontStyles } from '~/utils/fonts'
import InputTextArea from './InputTextArea'

import InputUnderline from './InputUnderline'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
}

export const CoreInput: React.FC<TextInputProps> = ({
  style,
  ...inputProps
}) => {
  return <TextInput style={[styles.coreInput, style]} {...inputProps} />
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

const styles = StyleSheet.create({
  coreInput: {
    ...subtitleFontStyles.middle,
    color: Colors.white,
    width: '100%',
  },
})

export default Input
