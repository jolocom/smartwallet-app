import React, { forwardRef } from 'react'
import { TextInputProps, TextInput, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import { scaleFont, fonts } from '~/utils/fonts'

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

const styles = StyleSheet.create({
  coreInput: {
    ...scaleFont(fonts.subtitle.middle),
    color: Colors.white,
    width: '100%',
  },
})
