import React, { useRef } from 'react'
import { LayoutChangeEvent, View, Text, StyleSheet } from 'react-native'
import { TITLE_HEIGHT } from './consts'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

const Title: ICollapsibleCloneComposite['Title'] = ({
  text,
  customContainerStyles = {},
}) => {
  const timesSet = useRef(0)
  const { onAddTitle, headerHeight } = useCollapsibleClone()

  const handleLayout = (event: LayoutChangeEvent) => {
    const { y, height } = event.nativeEvent.layout
    if (timesSet.current === 0) {
      onAddTitle({
        label: text,
        startY: y - headerHeight,
        endY: y + height - headerHeight,
      })
      timesSet.current++
    }
  }
  return (
    <View
      style={[styles.container, customContainerStyles]}
      onLayout={handleLayout}
    >
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
