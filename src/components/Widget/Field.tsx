import React from 'react'
import { StyleSheet, View } from 'react-native'
import FieldInput from './FieldInput'
import FieldValueDisplay from './FieldValueDisplay'

export type TField = IFieldComposition & React.FC

interface IFieldComposition {
  Input: React.FC
  ValueDisplay: React.FC
}

const Field: React.FC & IFieldComposition = ({ children }) => {
  return <View style={styles.container}>{children}</View>
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
})
Field.Input = FieldInput
Field.ValueDisplay = FieldValueDisplay

export default Field
