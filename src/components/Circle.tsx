import React from 'react'
import { Animated, StyleSheet, ViewStyle } from 'react-native'

import { Colors } from '~/utils/colors'

interface TransformI {
  scale: Animated.Value | number | Animated.AnimatedInterpolation
}

interface AnimatedStylesI {
  transform?: TransformI[]
  opacity?: Animated.Value | Animated.AnimatedInterpolation
}

interface PropsI {
  animatedStyles?: AnimatedStylesI | ViewStyle
  diameter: number
  color: Colors
  thickness?: number
}

const Circle: React.FC<PropsI> = ({
  animatedStyles,
  diameter,
  children,
  color,
  thickness = undefined,
}) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          borderColor: color,
          borderWidth: thickness ?? StyleSheet.hairlineWidth,
          overflow: 'hidden',
        },
        animatedStyles,
      ]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 10,
  },
})

export default Circle
