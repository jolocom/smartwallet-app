import React, { useRef } from 'react'
import { useEffect } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { TITLE_HEIGHT } from './consts'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

/**
 * NOTE: layout is calculated incorrectly sometimes
 */
const Title: ICollapsibleCloneComposite['Title'] = ({
  text,
  customContainerStyles = {},
}) => {
  const titleRef = useRef<View>(null)
  const { onAddTitle, containerY } = useCollapsibleClone()

  useEffect(() => {
    titleRef.current?.measureInWindow((x, y, width, height) => {
      const titlePositionInContainer = y - containerY
      onAddTitle({
        label: text,
        startY: titlePositionInContainer,
        endY: titlePositionInContainer + height,
      })
    })
  }, [])

  return (
    <View style={[styles.container, customContainerStyles]} ref={titleRef}>
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
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 10,
  },
})

export default Title
