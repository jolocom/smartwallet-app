import React, { useRef } from 'react'
import { View, StyleSheet, findNodeHandle } from 'react-native'
import { useCollapsible } from './context'
import { ICollapsibleComposite } from './types'

/**
 * NOTE: layout is calculated incorrectly sometimes
 */
const Title: ICollapsibleComposite['Title'] = ({
  text,
  customContainerStyles = {},
  children,
}) => {
  const titleRef = useRef<View>(null)
  const { onAddTitle, headerHeight, collapsibleRef } = useCollapsible()

  const handleLayout = () => {
    if (collapsibleRef.current !== null) {
      titleRef.current?.measureLayout(
        findNodeHandle(collapsibleRef.current)!,
        (x, y, width, height) => {
          const titlePosition = y - headerHeight
          onAddTitle({
            label: text,
            startY: titlePosition,
            endY: titlePosition + height,
          })
        },
        () => {
          // TODO: find a better way to handle this error
          console.log('Failed measuring title')
        },
      )
    }
  }

  return (
    <View
      style={[styles.container, customContainerStyles]}
      ref={titleRef}
      renderToHardwareTextureAndroid
      onLayout={handleLayout}
      testID="collapsible-title"
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    // borderColor: 'green',
    // borderWidth: 2,
  },
  titleText: {
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 10,
  },
})

export default Title
