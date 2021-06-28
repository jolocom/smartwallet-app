import React from 'react'
import { LayoutChangeEvent, View, Text, StyleSheet } from 'react-native'
import { HEADER_HEIGHT, TITLE_HEIGHT } from './consts'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const Title: ICollapsibleCloneComposite['Title'] = ({ text }) => {
  const { onAddTitle } = useCollapsibleClone()
  const handleLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout
    onAddTitle({
      label: text,
      startY: y - HEADER_HEIGHT,
      endY: y + height - HEADER_HEIGHT,
    })
  }
  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Text style={styles.titleText}>{text}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: TITLE_HEIGHT,
    borderColor: 'green',
    borderWidth: 2,
  },
  titleText: {
    borderColor: 'yellow',
    borderWidth: 2,
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 10,
  },
})

export default Title
