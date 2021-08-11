import React from 'react'
import { StyleSheet, View } from 'react-native'
import { PurpleTickSuccess } from '~/assets/svg'
import { Colors } from '~/utils/colors'
import { ScaledView } from '../ScaledCard'
import { FieldsCalculatorProps } from './types'

export const FieldsCalculator: React.FC<{
  cbFieldsVisibility: FieldsCalculatorProps
}> = ({ children, cbFieldsVisibility }) =>
  React.Children.map(children, cbFieldsVisibility) as React.ReactElement<
    unknown,
    string
  > | null

export const SelectedToggle: React.FC<{ selected: boolean }> = ({
  selected,
}) => {
  return (
    <ScaledView scaleStyle={styles.selectIndicator}>
      {selected ? <PurpleTickSuccess /> : <View style={styles.notSelected} />}
    </ScaledView>
  )
}

const styles = StyleSheet.create({
  selectIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
  },
  notSelected: {
    width: '100%',
    height: '100%',
    borderColor: Colors.black,
    opacity: 0.3,
    borderWidth: 1,
    borderRadius: 10,
  },
})
