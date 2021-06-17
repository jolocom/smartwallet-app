import { useRef } from 'react'
import { Animated } from 'react-native'

const INITIAL_SHADOW = 0.8
const INITIAL_MAGIC_BTN_OPACITY = 1
const INITIAL_CIRCLE_SCALE = 1.2

export const useMagicBtnAnimations = (animationDuration: number) => {
  // NOTE: the @shadow in this case is used for the view wrapping the @RadialGradient
  // component, which scales it up during a gesture. To avoid the inner circle
  // being scaled up as well, the @circle animated value is used to scale it
  // down accordingly. Not fully optimized, since the inner circle still scales up
  // a tiny bit. All of this is due to the lack of support of customizable shadows
  // on Android.
  const magicOpacity = useRef<Animated.Value>(
    new Animated.Value(INITIAL_MAGIC_BTN_OPACITY),
  ).current
  const shadowScale = useRef<Animated.Value>(
    new Animated.Value(INITIAL_SHADOW),
  ).current
  const circleScale = useRef<Animated.Value>(
    new Animated.Value(INITIAL_CIRCLE_SCALE),
  ).current

  const animate = (
    value: Animated.Value | Animated.ValueXY,
    toValue: number,
    duration: number,
  ) =>
    Animated.timing(value, {
      toValue,
      duration: duration,
      useNativeDriver: true,
    })

  const riseShadow = Animated.parallel([
    animate(shadowScale, 1, animationDuration),
    animate(circleScale, 1, animationDuration),
  ])

  const resetShadow = animate(shadowScale, INITIAL_SHADOW, 400)

  const resetMagic = Animated.parallel([
    resetShadow,
    animate(circleScale, INITIAL_CIRCLE_SCALE, 400),
  ])

  const hideMagicBtn = animate(magicOpacity, 0, 300)

  const animatedValues = {
    magicOpacity,
    shadowScale,
    circleScale,
  }

  const animateValues = {
    riseShadow,
    resetShadow,
    resetMagic,
    hideMagicBtn,
  }

  return {
    animatedValues,
    animateValues,
  }
}
