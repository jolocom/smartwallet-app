import React, { forwardRef } from 'react'
import { StyleSheet, TextInputProps, ViewStyle, TextInput } from 'react-native'
import { Colors } from '~/utils/colors'
import { fonts, scaleFont } from '~/utils/fonts'
import InputBlock from './InputBlock'
import InputTextArea from './InputTextArea'
import InputUnderline from './InputUnderline'

export interface IInput extends TextInputProps {
  value: string
  updateInput: (val: string) => void
  containerStyle?: ViewStyle
  isValid?: boolean
}

export const CoreInput = forwardRef<TextInput, TextInputProps>((props, ref) => {
  const { style, ...inputProps } = props
  return (
    <TextInput
      testID="core-input"
      ref={ref}
      autoCorrect={false}
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
    ...scaleFont(fonts.subtitle.middle),
    color: Colors.white,
    width: '100%',
  },
})

export default Input
