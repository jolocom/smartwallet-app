import React, { useState } from 'react'
import {
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { CoreInput } from './CoreInput'
import { IInput } from './types'

const InputBlock = React.forwardRef<TextInput, IInput>(
  (
    {
      updateInput,
      value,
      containerStyle = {},
      withHighlight = false,
      ...inputProps
    },
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    const handleFocus = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      inputProps.onFocus && inputProps.onFocus(e)
      setIsFocused(true)
    }

    const handleBlur = (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      inputProps.onBlur && inputProps.onBlur(e)
      setIsFocused(false)
    }

    return (
      <View
        style={[
          styles.block,
          containerStyle,
          withHighlight && isFocused && { borderColor: Colors.success },
        ]}
      >
        <CoreInput
          {...inputProps}
          ref={ref}
          onChangeText={updateInput}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    )
  },
)

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
  },
})

export default InputBlock
