import { useRef } from 'react'
import { Animated } from 'react-native'

interface ReturnedI {
  animatedScale1: Animated.Value
  animatedScale2: Animated.Value
  animatedOpacity1: Animated.AnimatedInterpolation
  animatedOpacity2: Animated.AnimatedInterpolation
  startScaling: Animated.CompositeAnimation
}

const useAnimatedCircles = (
  initialScale1: number,
  initialScale2: number,
  maxScale1: number,
  maxScale2: number,
  delay: number,
): ReturnedI => {
  const animatedScale1 = useRef(new Animated.Value(initialScale1)).current
  const animatedScale2 = useRef(new Animated.Value(initialScale2)).current
  const animatedOpacity1 = animatedScale1.interpolate({
    inputRange: [2, maxScale1],
    outputRange: [1, 0],
  })
  const animatedOpacity2 = animatedScale2.interpolate({
    inputRange: [2, maxScale2],
    outputRange: [1, 0],
  })

  const startScaling = Animated.parallel([
    Animated.sequence([
      Animated.timing(animatedScale1, {
        toValue: maxScale1,
        duration: 1700,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale1, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]),
    Animated.sequence([
      Animated.timing(animatedScale2, {
        toValue: maxScale2,
        delay: 700,
        duration: 1700,
        useNativeDriver: true,
      }),
      Animated.timing(animatedScale2, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      }),
    ]),
  ])

  return {
    animatedScale1,
    animatedScale2,
    animatedOpacity1,
    animatedOpacity2,
    startScaling,
  }
}

export default useAnimatedCircles
