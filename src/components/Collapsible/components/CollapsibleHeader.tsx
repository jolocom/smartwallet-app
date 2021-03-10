import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
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

  return (
    <View
      style={[
        styles.container,
        { height: top + height, paddingTop: top },
        customStyles,
      ]}
    >
      {children}
    </View>
  )
}

export const AnimatedHeader: ICollapsibleComposite['AnimatedHeader'] = ({
  children,
  customStyles,
  height = COLLAPSIBLE_HEADER_HEIGHT,
}) => {
  const { distanceToText, interpolateYValue } = useCollapsible()
  const { top } = useSafeArea()

  const headerOpacityValue = interpolateYValue(
    [distanceToText * 0.2, distanceToText * 0.3],
    [0, 1],
  )

  return (
    <Animated.View
      pointerEvents="none"
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
