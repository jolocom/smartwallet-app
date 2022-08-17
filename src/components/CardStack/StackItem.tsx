import React, { useMemo } from 'react'
import { TouchableOpacity } from 'react-native'
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

export interface ExpandState {
  stackId: string
  itemId: string
}

export interface StackItemConfig {
  itemHeight: number
  visibleHeaderHeight: number
  itemDistance: number
}

export interface StackItemProps extends StackItemConfig {
  stackId: string
  index: number
  onPress: () => void
  expandState: Animated.SharedValue<ExpandState | null>
  prevItemId: string | undefined
}

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const springConfig: Animated.WithSpringConfig = {
  damping: 20,
  mass: 2,
  stiffness: 200,
  velocity: 2,
}

const timingConfig = {
  duration: 200,
}

export const StackItem: React.FC<StackItemProps> = ({
  onPress,
  stackId,
  index,
  itemHeight,
  visibleHeaderHeight,
  itemDistance,
  children,
  expandState,
  prevItemId,
}) => {
  const expandedMargin = useMemo(
    () => -(itemHeight - visibleHeaderHeight + itemDistance),
    [itemDistance, itemHeight, visibleHeaderHeight],
  )

  const isExpanded = useDerivedValue(() => {
    if (expandState.value) {
      const isSameStack = expandState.value.stackId === stackId
      const isSameItem = expandState.value.itemId === prevItemId
      if (isSameStack && isSameItem) {
        return true
      }
    }

    return false
  })

  const animatedStyle = useAnimatedStyle(() => ({
    marginTop:
      index === 0
        ? withTiming(0, timingConfig)
        : isExpanded.value
        ? withTiming(0, timingConfig)
        : withSpring(expandedMargin, springConfig),
  }))

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      activeOpacity={1}
      style={[
        {
          alignItems: 'center',
          marginBottom: itemDistance,
          zIndex: index,
        },
        animatedStyle,
      ]}
    >
      {children}
    </AnimatedTouchableOpacity>
  )
}
