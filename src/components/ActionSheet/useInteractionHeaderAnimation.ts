import { Animated } from 'react-native'

const useInteractionHeaderAnimation = (yPositionValue: Animated.Value) => {
  const interpolateScroll = (inputRange: number[], outputRange: number[]) =>
    yPositionValue.interpolate({
      inputRange,
      outputRange,
      extrapolate: 'clamp',
    })

  const detailsOpacityValue = interpolateScroll([0, 60], [1, 0])
  const profileScaleValue = interpolateScroll([0, 120], [1, 0.6])
  const titlePosition = interpolateScroll([0, 100], [0, 0])
  const iconPosition = interpolateScroll([0, 100], [0, 20])

  const animatedScaleStyle = [
    {
      transform: [
        { scaleY: profileScaleValue },
        { scaleX: profileScaleValue },
        { translateY: iconPosition },
      ],
      opacity: detailsOpacityValue,
    },
  ]

  const animatedTitleStyle = [{ transform: [{ translateY: titlePosition }] }]

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

  return { animatedScaleStyle, animatedOpacityStyle, animatedTitleStyle }
}

export default useInteractionHeaderAnimation
