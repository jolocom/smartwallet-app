import React from 'react'
import { StyleSheet, View } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { Colors } from '~/utils/colors'
import { IInput } from '.'

const InputBlock: React.FC<IInput> = ({ updateInput, value }) => {
  return (
    <View style={styles.block}>
      <TextInput onChangeText={updateInput} value={value} />
    </View>
  )
}

const styles = StyleSheet.create({
  block: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    paddingHorizontal: 23,
    backgroundColor: Colors.black,
    borderRadius: 8,
    height: 50,
    marginVertical: 2,
  },
})

export default InputBlock
