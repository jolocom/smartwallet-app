import { useRef } from 'react'
import { Animated } from 'react-native'

const useCollapsedScrollViewAnimations = (animationStart: number) => {
  const yPositionValue = useRef(new Animated.Value(0)).current

  const interpolateScroll = (inputRange: number[], outputRange: number[]) =>
    yPositionValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  const handleScroll = Animated.event(
    [
      {
        nativeEvent: { contentOffset: { y: yPositionValue } },
      },
    ],
    { useNativeDriver: true },
  )

  const headerOpacityValue = interpolateScroll(
    [animationStart + 10, animationStart + 15],
    [0, 1],
  )
  const headerTextPositionValue = interpolateScroll(
    [animationStart, animationStart + 50],
    [50, 0],
  )
  const headerTextOpacityValue = interpolateScroll(
    [animationStart + 30, animationStart + 40],
    [0, 1],
  )

  const componentOpacityValue = interpolateScroll([0, 60], [1, 0])
  const componentScaleValue = interpolateScroll([0, 120], [1, 0.6])
  const componentPositionValue = interpolateScroll([0, 100], [0, 20])

  return {
    handleScroll,
    headerAnimatedValues: {
      headerOpacityValue,
      headerTextPositionValue,
      headerTextOpacityValue,
    },
    componentAnimatedValues: {
      componentOpacityValue,
      componentScaleValue,
      componentPositionValue,
    },
  }
}

export default useCollapsedScrollViewAnimations
