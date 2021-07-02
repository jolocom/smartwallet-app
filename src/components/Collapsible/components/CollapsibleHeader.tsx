import React from 'react'
import { View, StyleSheet, Animated, LayoutChangeEvent } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import { useCollapsible } from '../context'
import { ICollapsibleComposite } from '../types'

export const COLLAPSIBLE_HEADER_HEIGHT = 50

export const Header: ICollapsibleComposite['Header'] = ({
  children,
  customStyles,
  height = COLLAPSIBLE_HEADER_HEIGHT,
}) => {
  const { top } = useSafeArea()
  const { interpolateYValue, setHeaderHeight } = useCollapsible()

  const shadowOpacityValue = interpolateYValue([0, 10], [0, 1])
  const elevationValue = interpolateYValue([0, 10], [0, 20])

  const handleLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height - top)
  }

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[
        styles.container,
        styles.containerShadows,
        { shadowOpacity: shadowOpacityValue, elevation: elevationValue },
        { height: top + height, paddingTop: top },
        customStyles,
      ]}
    >
      {children}
    </Animated.View>
  )
}
export const AnimatedHeader: ICollapsibleComposite['AnimatedHeader'] = ({
  children,
  customStyles,
  height = COLLAPSIBLE_HEADER_HEIGHT,
}) => {
  const {
    interpolateYValue,
    setHeaderHeight,
    distanceToHeader,
  } = useCollapsible()
  const { top } = useSafeArea()

  const headerOpacityValue = interpolateYValue(
    [distanceToHeader * 0.2, distanceToHeader * 0.3],
    [0, 1],
  )

  const handleLayout = (e: LayoutChangeEvent) => {
    setHeaderHeight(e.nativeEvent.layout.height - top)
  }

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[
        styles.container,
        styles.containerShadows,
        {
          opacity: headerOpacityValue,
          height: top + height,
          paddingTop: top,
        },
        customStyles,
      ]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.mainBlack,
    position: 'absolute',
    top: 0,
    zIndex: 3,
  },
  containerShadows: {
    elevation: 20,
    shadowColor: Colors.black65,
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowRadius: 11,
    shadowOpacity: 1,
    // HACK: @elevation won't work without @borderBottomWidth
    // https://github.com/timomeh/react-native-material-bottom-navigation/issues/8
    borderBottomWidth: 0,
  },
})