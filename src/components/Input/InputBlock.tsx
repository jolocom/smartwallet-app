import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from '~/utils/colors'
import { CoreInput, IInput } from '.'

const InputBlock = React.forwardRef<TextInput, IInput>(
  ({ updateInput, value, ...inputProps }, ref) => {
    return (
      <View style={styles.block}>
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
  },
})

export default InputBlock
