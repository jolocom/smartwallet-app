import { useRef } from 'react'
import { Animated } from 'react-native'

const useCollapsedScrollViewAnimations = (headerHeight: number) => {
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
    [headerHeight * 0.2, headerHeight * 0.3],
    [0, 1],
  )
  const headerTextPositionValue = interpolateScroll(
    [headerHeight * 0.6, headerHeight * 0.8],
    [50, 0],
  )
  const headerTextOpacityValue = interpolateScroll(
    [headerHeight * 0.7, headerHeight * 0.8],
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
