import React, { forwardRef } from 'react'
import { StyleSheet, TextInputProps } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from '~/utils/colors'
import { subtitleFontStyles } from '~/utils/fonts'
import InputBlock from './InputBlock'
import InputTextArea from './InputTextArea'

import InputUnderline from './InputUnderline'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
}

export const CoreInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { style, ...inputProps } = props
  return (
    <TextInput
      ref={ref}
      style={[styles.coreInput, style]}
      placeholderTextColor={Colors.white70}
      {...inputProps}
    />
  )
})

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
