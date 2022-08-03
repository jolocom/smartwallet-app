import React, { useEffect, useState, useRef } from 'react'
import { ScrollView, TouchableOpacity, View } from 'react-native'
import Animated, {
  useAnimatedProps,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
  scrollTo,
  useAnimatedRef,
} from 'react-native-reanimated'
import {
  ORIGINAL_DOCUMENT_CARD_HEIGHT,
  ORIGINAL_DOCUMENT_CARD_WIDTH,
} from '~/components/Cards/consts'
import ScreenContainer from '~/components/ScreenContainer'

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity)

const VERTICAL_MARGIN = 12
const VISIBLE_HEADER = 40

interface CardProps {
  idx: number
  onPress: () => void
  isExpanded: boolean
}
const Card: React.FC<CardProps> = React.memo(
  ({ idx, onPress, isExpanded, children }) => {
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
          idx === 0
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
            zIndex: idx,
            backgroundColor: idx % 2 === 0 ? 'red' : 'blue',
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

interface StackScrollViewProps<T> {
  data: Array<T>
}

const StackScrollView: React.FC<StackScrollViewProps<unknown>> = ({ data }) => {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const handlePress = (id: number) => {
    //scrollTo(scrollRef, 0, ORIGINAL_DOCUMENT_CARD_HEIGHT / 2, true)
    //scrollRef.current.scrollTo({ x: 0, y: ORIGINAL_DOCUMENT_CARD_HEIGHT / 2 })
    setExpandedId(id)
  }

  const resetStack = () => {
    setExpandedId(null)
  }

  const scrollHandler = useAnimatedScrollHandler(
    {
      onBeginDrag: (event) => {
        if (expandedId) {
          console.log(JSON.stringify(event, null, 2))
          runOnJS(resetStack)()
          //runOnJS(setExpandVelocity)(event.velocity?.y)
        }
      },
    },
    [expandedId],
  )

  return (
    <Animated.ScrollView
      onScroll={scrollHandler}
      //ref={scrollRef}
      scrollEventThrottle={4}
      contentContainerStyle={{
        paddingVertical: 40,
        width: '100%',
        paddingTop: 80,
      }}
    >
      {data.map((n, i) => {
        return (
          <Card
            key={i}
            idx={i}
            onPress={() => handlePress(i)}
            isExpanded={expandedId !== null ? n === expandedId + 1 : false}
          />
        )
      })}
    </Animated.ScrollView>
  )
}

const CardStack = () => {
  //const scrollRef = useAnimatedRef<Animated.ScrollView>()

  return (
    <ScreenContainer>
      <StackScrollView data={[0, 1, 2, 3, 4, 5]} />
    </ScreenContainer>
  )
}

/*
 *
 * const expandedId = useSharedValue(null)
 *
 *
 *
 *
 */

export default CardStack
