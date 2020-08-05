import { useRef } from 'react'
import { Animated } from 'react-native'

const useScrollAnimation = () => {
  const yPositionValue = useRef(new Animated.Value(0)).current
  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: yPositionValue } },
      },
    ],
    { useNativeDriver: true },
  )

  return {
    handleScroll,
    yPositionValue,
  }
}

export default useScrollAnimation
