import React, { useEffect } from 'react'
import { Animated, View, StyleSheet } from 'react-native'
import useAnimatedCircles from '~/hooks/useAnimatedCircles'
import { Colors } from '~/utils/colors'

interface CirclePropsI {
  animatedValue: Animated.Value
  animatedOpacity: Animated.AnimatedInterpolation
  color: Colors
}

interface RipplePropsI {
  color: Colors
  initialValue1: number
  maxValue1: number
  maxValue2: number
}

const Circle: React.FC<CirclePropsI> = ({
  animatedValue,
  animatedOpacity,
  color,
}) => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        transform: [{ scale: animatedValue }],
        opacity: animatedOpacity,
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: color,
      }}
    >
      {/*  the border of the circle once is scaled get pixelated
        therefore drawing 2 circles to avoid border pixelation
        one inside of the other
        the outer has a background color depending on the Loader type
        the inner circle is of the color of the screen */}
      <View style={styles.nestedCircle} />
    </Animated.View>
  )
}

const Ripple: React.FC<RipplePropsI> = ({
  color,
  initialValue1,
  maxValue1,
  maxValue2,
}) => {
  const {
    animatedScale1,
    animatedScale2,
    animatedOpacity1,
    animatedOpacity2,
    startScaling,
  } = useAnimatedCircles(initialValue1, 0, maxValue1, maxValue2, 3000)

  useEffect(() => {
    Animated.loop(startScaling).start()
  }, [])

  return (
    <>
      <Circle
        animatedValue={animatedScale1}
        animatedOpacity={animatedOpacity1}
        color={color}
      />
      <Circle
        animatedValue={animatedScale2}
        animatedOpacity={animatedOpacity2}
        color={color}
      />
    </>
  )
}

const styles = StyleSheet.create({
  nestedCircle: {
    position: 'absolute',
    top: 0.3,
    left: 0.3,
    width: 17.4,
    height: 17.4,
    borderRadius: 8.7,
    backgroundColor: Colors.mainBlack,
  },
})

export default Ripple
