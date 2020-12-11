import React from 'react'
import { StyleSheet, TextInputProps, ViewStyle, TextInput } from 'react-native'
import { Colors } from '~/utils/colors'
import { subtitleFontStyles } from '~/utils/fonts'
import InputBlock from './InputBlock'
import InputTextArea from './InputTextArea'

import InputUnderline from './InputUnderline'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
  containerStyle?: ViewStyle
}

export const CoreInput: React.FC<TextInputProps> = ({
  style,
  ...inputProps
}) => {
  return (
    <TextInput
      autoCorrect={false}
      style={[styles.coreInput, style]}
      placeholderTextColor={Colors.white30}
      {...inputProps}
    />
  )
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
