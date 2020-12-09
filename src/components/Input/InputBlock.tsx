import React from 'react'
import { StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { CoreInput, IInput } from '.'

const InputBlock: React.FC<IInput> = ({
  updateInput,
  value,
  ...inputProps
}) => {
  return (
    <View style={styles.block}>
      <CoreInput {...inputProps} onChangeText={updateInput} value={value} />
    </View>
  )
}

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
