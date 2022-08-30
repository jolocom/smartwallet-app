import React, { useEffect } from 'react'
import { Alert, Text, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
} from '~/components/Cards/consts'
import { StackScrollView } from '~/components/CardStack'
import ScreenContainer from '~/components/ScreenContainer'

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const VERTICAL_MARGIN = 12
const VISIBLE_HEADER = 40

interface CardProps {
  id: number | string
  index: number
  onPress: () => void
  isExpanded: boolean
}
const Card: React.FC<CardProps> = React.memo(
  ({ id, index, onPress, isExpanded, children }) => {
    useEffect(() => {
      console.log({ isExpanded })
    }, [isExpanded])
    const expandedMargin = -(
      ORIGINAL_DOCUMENT_CARD_HEIGHT -
      VERTICAL_MARGIN -
      VISIBLE_HEADER
    )
    const springConfig: Animated.WithSpringConfig = {
      damping: 15,
      mass: 1,
      stiffness: 200,
      velocity: 2,
    }

    const timingConfig = {
      duration: 200,
    }

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
            width: ORIGINAL_DOCUMENT_CARD_WIDTH,
            height: ORIGINAL_DOCUMENT_CARD_HEIGHT,
            borderRadius: 14,
            marginBottom: VERTICAL_MARGIN,
            zIndex: index,
          },
          animatedStyle,
        ]}
      >
        {children}
      </AnimatedTouchableOpacity>
    )
  },
  (prev, next) => prev.isExpanded === next.isExpanded,
)

interface StackScrollViewProps<T extends { id: string | number }> {
  data: Array<T>
  renderCard: (item: T, i: number) => React.ReactNode
}

const CardStack = () => {
  return (
    <ScreenContainer>
      <StackScrollView
        data={[
          { stackId: '1', data: [{ id: '1' }, { id: '2' }, { id: '3' }] },
          { stackId: '2', data: [{ id: '1' }, { id: '2' }, { id: '3' }] },
        ]}
        renderStack={(data, Item) => {
          return (
            <View style={{ marginBottom: 40, width: '100%' }}>
              <Text>{data.stackId}</Text>
              {Item}
            </View>
          )
        }}
        renderItem={(data, i) => {
          return (
            <View
              style={{
                paddingTop: 100,
                backgroundColor: i % 2 ? 'red' : 'blue',
              }}
            >
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  Alert.alert('Pressed')
                }}
                style={{
                  width: 300,
                  height: 400,
                  backgroundColor: 'black',
                }}
              >
                <Text>{data.id}</Text>
              </TouchableOpacity>
            </View>
          )
        }}
        itemHeight={400}
        visibleHeaderHeight={100}
        itemDistance={30}
      />
    </ScreenContainer>
  )
}
export default CardStack
