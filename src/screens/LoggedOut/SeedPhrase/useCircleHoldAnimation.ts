import { useRef, useState } from 'react'
import { Animated, GestureResponderEvent } from 'react-native'

export enum GestureState {
  None,
  Start,
  End,
  Success,
}

const useCircleHoldAnimation = (animationDuration: number) => {
  const [startTime, setStartTime] = useState(0)
  const [gestureState, setGestureState] = useState<GestureState>(
    GestureState.None,
  )

  // NOTE: the @shadow in this case is used for the view wrapping the @RadialGradient
  // component, which scales it up during a gesture. To avoid the inner circle
  // being scaled up as well, the @circle animated value is used to scale it
  // down accordingly. Not fully optimized, since the inner circle still scales up
  // a tiny bit. All of this is due to the lack of support of customizable shadows
  // on Android.
  const shadowOpacity = useRef<Animated.Value>(new Animated.Value(1)).current
  const shadowScale = useRef<Animated.Value>(new Animated.Value(0.8)).current
  const circleScale = useRef<Animated.Value>(new Animated.Value(1.2)).current

  const onTouchStart = (e: GestureResponderEvent) => {
    setStartTime(e.nativeEvent.timestamp)
    setGestureState(GestureState.Start)
    Animated.parallel([
      Animated.timing(shadowScale, {
        duration: animationDuration,
        toValue: 1,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        duration: animationDuration,
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onTouchEnd = () => {
    if (gestureState !== GestureState.Success) setGestureState(GestureState.End)
    Animated.parallel([
      Animated.timing(shadowScale, {
        duration: 400,
        toValue: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(circleScale, {
        duration: 400,
        toValue: 1.2,
        useNativeDriver: true,
      }),
    ]).start()
  }

  const onTouchMove = (e: GestureResponderEvent) => {
    // NOTE: finishes the gesture with the state @GestureState.Success if
    // the duration of the gesture was equal/longer than the required success duration.
    // Not calculated in @onTouchEnd because the @Success state will be triggered
    // only after the finger was lifted, while here it is triggered continuously
    // when the finger is moved (and there is always some small movement), allowing
    // the state to change while the gesture was not yet finished.
    if (e.nativeEvent.timestamp - startTime >= animationDuration)
      setGestureState(GestureState.Success)
  }

  const gestureHandlers = { onTouchStart, onTouchEnd, onTouchMove }
  const animationValues = {
    shadowScale,
    circleScale,
    shadowOpacity,
  }
  return {
    gestureState,
    animationValues,
    gestureHandlers,
  }
}

export default useCircleHoldAnimation
