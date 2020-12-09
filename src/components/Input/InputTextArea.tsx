import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { strings } from '~/translations'
import BP from '~/utils/breakpoints'
import { Colors } from '~/utils/colors'
import { IInput } from '.'
import Block from '../Block'

const InputTextArea: React.FC<IInput> = ({
  value,
  updateInput,
  ...inputProps
}) => {
  return (
    <Block customStyle={{ padding: 13 }}>
      <TextInput
        placeholder={`${strings.TAP_TO_WRITE}...`}
        placeholderTextColor={Colors.white70}
        value={value}
        onChangeText={updateInput}
        multiline
        style={styles.inputStyle}
        {...inputProps}
      />
    </Block>
  )
}

const styles = StyleSheet.create({
  inputStyle: {
    height: BP({ default: 196, small: 150, xsmall: 150 }),
    textAlignVertical: 'top',
  },
})

export default InputTextArea
