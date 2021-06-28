import React from 'react'
import { StyleSheet, View } from 'react-native'
import CollapsibleClone from '~/components/CollapsibleClone'
import ScreenContainer from '~/components/ScreenContainer'

export const TITLE_LABEL_1 = 'ONE'
export const TITLE_LABEL_2 = 'TWO'

const CollapsibleTest = () => {
  return (
    <ScreenContainer
      customStyles={{
        justifyContent: 'flex-start',
        flex: 1,
        paddingHorizontal: 0,
      }}
    >
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
    </ScreenContainer>
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
