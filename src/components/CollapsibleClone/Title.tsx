import React, { useRef } from 'react'
import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
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
  const { onAddTitle, containerY, headerHeight } = useCollapsibleClone()

  useEffect(() => {
    if (containerY !== undefined) {
      titleRef.current?.measureInWindow((x, y, width, height) => {
        /**
         * to get a proper position of the title,
         * first, we need to find the position of y within the collapsible container,
         * which is y - containerY;
         * secondly, we need to subtract from it header height
         */
        const titlePositionInContainer = y - containerY - headerHeight
        onAddTitle({
          label: text,
          startY: titlePositionInContainer,
          endY: titlePositionInContainer + height,
        })
      })
    }
  }, [containerY])

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
