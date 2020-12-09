import React from 'react'
import { TextInput, View } from 'react-native'
import { debugView } from '~/utils/dev'

export interface IFieldBlock {
  updateField: (val: string) => void
  value: string
}

const FormField: React.FC<IFieldBlock> = ({ updateField, value }) => {
  return (
    <View style={{ ...debugView() }}>
      <TextInput value={value} onChangeText={updateField} />
    </View>
  )
}

export default FormField
