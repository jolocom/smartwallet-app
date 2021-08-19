import React, { useRef } from 'react'
import { useEffect } from 'react'
import { View, StyleSheet, findNodeHandle } from 'react-native'
import { useCollapsibleClone } from './context'
import { ICollapsibleCloneComposite } from './types'

/**
 * NOTE: layout is calculated incorrectly sometimes
 */
const Title: ICollapsibleCloneComposite['Title'] = ({
  text,
  customContainerStyles = {},
  children,
}) => {
  const titleRef = useRef<View>(null)
  const { onAddTitle, headerHeight, collapsibleCloneRef } =
    useCollapsibleClone()

  useEffect(() => {
    if (collapsibleCloneRef.current !== null) {
      titleRef.current?.measureLayout(
        findNodeHandle(collapsibleCloneRef.current)!,
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
  }, [])

  return (
    <View
      style={[styles.container, customContainerStyles]}
      ref={titleRef}
      renderToHardwareTextureAndroid
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
