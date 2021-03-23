import React from 'react'
import { StyleSheet, TextInput } from 'react-native'
import { strings } from '~/translations'
import BP from '~/utils/breakpoints'
import { IInput } from './types'
import { CoreInput } from './CoreInput'
import Block from '../Block'

const InputTextArea = React.forwardRef<TextInput, IInput>(
  ({ value, updateInput, ...inputProps }, ref) => {
    return (
      <Block customStyle={{ padding: 13 }}>
        <CoreInput
          ref={ref}
          placeholder={`${strings.TAP_TO_WRITE}...`}
          value={value}
          onChangeText={updateInput}
          multiline
          style={styles.inputStyle}
          {...inputProps}
        />
      </Block>
    )
  },
)

const styles = StyleSheet.create({
  inputStyle: {
    height: BP({ default: 196, small: 150, xsmall: 150 }),
    textAlignVertical: 'top',
  },
})

export default InputTextArea
