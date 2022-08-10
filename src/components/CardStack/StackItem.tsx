import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export interface StackItemConfig {
  itemHeight: number
  visibleHeaderHeight: number
  itemDistance: number
}

export interface StackItemProps extends StackItemConfig {
  id: string
  index: number
  onPress: () => void
  isExpanded: boolean
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const springConfig: Animated.WithSpringConfig = {
  damping: 15,
  mass: 1,
  stiffness: 200,
  velocity: 2,
}

const timingConfig = {
  duration: 200,
}

export const StackItem: React.FC<StackItemProps> = ({
  onPress,
  id,
  index,
  itemHeight,
  visibleHeaderHeight,
  isExpanded,
  itemDistance,
  children,
}) => {
  const expandedMargin = useMemo(
    () => -(itemHeight - visibleHeaderHeight + itemDistance),
    [itemDistance, itemHeight, visibleHeaderHeight],
  )

  const animatedStyle = useAnimatedStyle(
    () => ({
      marginTop:
        index === 0
          ? withTiming(0, timingConfig)
          : isExpanded
          ? withTiming(0, timingConfig)
          : withSpring(expandedMargin, springConfig),
    }),
    [isExpanded],
  )

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[
        {
          marginBottom: itemDistance,
          zIndex: index,
          alignItems: 'center',
        },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedTouchableOpacity>
  )
}
