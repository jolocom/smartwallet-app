import React from 'react'
import { StyleSheet } from 'react-native'
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
      {selected ? (
        <PurpleTickSuccess />
      ) : (
        <ScaledView
          scaleStyle={styles.notSelectedScale}
          style={styles.notSelected}
        />
      )}
    </ScaledView>
  )
}

const styles = StyleSheet.create({
  selectIndicator: {
    position: 'absolute',
    width: 20,
    height: 20,
    top: 8,
    right: 8,
  },
  notSelected: {
    borderColor: Colors.black,
    opacity: 0.3,
  },
  notSelectedScale: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderRadius: 10,
  },
})
