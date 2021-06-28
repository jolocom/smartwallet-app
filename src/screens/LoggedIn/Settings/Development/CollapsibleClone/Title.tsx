import React from 'react'
import { LayoutChangeEvent, View, Text, StyleSheet } from 'react-native'
import {
  HEADER_HEIGHT,
  TITLE_HEIGHT,
} from '~/screens/LoggedIn/Settings/Development/CollapsibleClone/consts'
import { TTitle } from '~/screens/LoggedIn/Settings/Development/CollapsibleClone/types'

interface ITitle {
  text: string
  onAddTitle: (title: TTitle) => void
}

const Title: React.FC<ITitle> = ({ text, onAddTitle }) => {
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
