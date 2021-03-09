import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'
import { useCollapsible } from '../context'
import { IWithCustomStyle } from '~/components/Card/types'

export const Header: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
}) => {
  const { top } = useSafeArea()

  return (
    <View style={[styles.container, { height: top + 62 }, customStyles]}>
      {children}
    </View>
  )
}

export const AnimatedHeader: React.FC<IWithCustomStyle> = ({
  children,
  customStyles,
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
        styles.absoluteContainer,
        {
          opacity: headerOpacityValue,
          height: 62 + top,
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
    zIndex: 3,
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
    backgroundColor: Colors.mainBlack,
  },
  absoluteContainer: {
    position: 'absolute',
    top: 0,
  },
})
