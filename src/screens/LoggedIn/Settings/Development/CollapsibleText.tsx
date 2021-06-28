import React from 'react'
import { StyleSheet, View } from 'react-native'
import CollapsibleClone from '~/components/CollapsibleClone'

export const TITLE_LABEL_1 = 'ONE'
export const TITLE_LABEL_2 = 'TWO'

const CollapsibleTest = () => {
  return (
    <CollapsibleClone renderHeader={() => <CollapsibleClone.Header />}>
      <CollapsibleClone.Title text="ONE" />
      {[...Array(5).keys()].map((i) => (
        <View style={styles.rect} />
      ))}
      <CollapsibleClone.Title text="TWO" />
      {[...Array(20).keys()].map((i) => (
        <View style={styles.rect} />
      ))}
    </CollapsibleClone>
  )
}

const styles = StyleSheet.create({
  rect: {
    width: '100%',
    height: 40,
    borderColor: 'purple',
    borderWidth: 2,
    paddingBottom: 20,
    backgroundColor: 'palegreen',
  },
})

export default CollapsibleTest
