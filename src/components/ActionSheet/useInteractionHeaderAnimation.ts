import { Animated } from 'react-native'

const useInteractionHeaderAnimation = (yPositionValue: Animated.Value) => {
  const interpolateScroll = (inputRange: number[], outputRange: number[]) =>
    yPositionValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  const detailsOpacityValue = interpolateScroll([0, 100], [1, 0])
  const profileScaleValue = interpolateScroll([0, 100], [1, 0.8])

  const animatedScaleStyle = [
    {
      transform: [
        { scaleY: profileScaleValue },
        { scaleX: profileScaleValue },
        { translateY: yPositionValue },
      ],
      opacity: detailsOpacityValue,
    },
  ]

  const animatedOpacityStyle = [
    {
      transform: [
        {
          translateY: yPositionValue,
        },
      ],
      opacity: detailsOpacityValue,
    },
  ]

  return { animatedScaleStyle, animatedOpacityStyle }
}

export default useInteractionHeaderAnimation
