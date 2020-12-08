import React from 'react'
import { TextInput, View } from 'react-native'
import FieldContainer from '~/components/FieldContainer'
import { debugView } from '~/utils/dev'
import { useForm } from './Form'

const FormField: React.FC = ({ updateField, ...rest }) => {
  console.log({ rest })

  const { value } = rest

  return (
    <View style={{ ...debugView() }}>
      <TextInput value={value} onChangeText={() => updateField(type, value)} />
    </View>
  )
}

export default FormField
