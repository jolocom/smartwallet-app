import React from 'react'
import { Animated, LayoutChangeEvent } from 'react-native'
import { useCollapsible } from '../context'

export const HidingScale: React.FC = ({ children }) => {
  const { setDistanceToText, interpolateYValue } = useCollapsible()

  // TODO @clauxx: should be moved to @HidingText
  const handleLayout = (e: LayoutChangeEvent) => {
    setDistanceToText(e.nativeEvent.layout.height)
  }

  const componentOpacityValue = interpolateYValue([0, 60], [1, 0])
  const componentScaleValue = interpolateYValue([0, 120], [1, 0.6])
  const componentPositionValue = interpolateYValue([0, 100], [0, 20])

  return (
    <Animated.View
      onLayout={handleLayout}
      style={[
        {
          transform: [
            { scaleX: componentScaleValue },
            { scaleY: componentScaleValue },
            { translateY: componentPositionValue },
          ],
          opacity: componentOpacityValue,
        },
      ]}
    >
      {children}
    </Animated.View>
  )
}
