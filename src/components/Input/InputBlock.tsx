import React from 'react'
import { StyleSheet, View, TextInput } from 'react-native'
import { Colors } from '~/utils/colors'
import { CoreInput } from './CoreInput'
import { IInput } from './types'

const InputBlock = React.forwardRef<TextInput, IInput>(
  ({ updateInput, value, containerStyle = {}, ...inputProps }, ref) => {
    return (
      <View style={[styles.block, containerStyle]}>
        <CoreInput
          {...inputProps}
          ref={ref}
          onChangeText={updateInput}
          value={value}
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
