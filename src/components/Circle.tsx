import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'

import { Colors } from '~/utils/colors'

interface TransformI {
  scale: Animated.Value | number
}

interface AnimatedStylesI {
  transform?: TransformI[]
  opacity?: Animated.Value | Animated.AnimatedInterpolation
}

interface PropsI {
  animatedStyles?: AnimatedStylesI
  diameter: number
  bgColor: Colors
}

const Circle: React.FC<PropsI> = ({
  animatedStyles,
  diameter,
  children,
  bgColor,
}) => {
  return (
    <Animated.View
      style={[
        styles.container,
        {
          width: diameter,
          height: diameter,
          borderRadius: diameter / 2,
          backgroundColor: bgColor,
        },
        animatedStyles,
      ]}
    >
      {/*  the border of the circle once is scaled get pixelated
        therefore drawing 2 circles to avoid border pixelation
        one inside of the other
        the outer has a background color depending on the Loader type
        the inner circle is of the color of the screen */}
      <View style={styles.nestedCircle} />
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
  },
  nestedCircle: {
    position: 'absolute',
    top: 0.3,
    left: 0.3,
    width: 17.4,
    height: 17.4,
    borderRadius: 8.7,
    backgroundColor: Colors.black,
  },
})

export default Circle
