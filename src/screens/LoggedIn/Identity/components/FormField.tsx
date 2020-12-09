import React from 'react'
import { TextInput, View } from 'react-native'
import { debugView } from '~/utils/dev'

export interface IFieldBlock {
  updateValue: (val: string) => void
  value: string
}

const FormField: React.FC<IFieldBlock> = ({ updateValue, value }) => {
  return (
    <View style={{ ...debugView() }}>
      <TextInput value={value} onChangeText={updateValue} />
    </View>
  )
}

export default FormField
