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

const VERTICAL_MARGIN = 12
const VISIBLE_HEADER = 40

interface CardProps {
  idx: number
  onPress: () => void
  isExpanded: boolean
}
const Card: React.FC<CardProps> = React.memo(
  ({ idx, onPress, isExpanded }) => {
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
      <Animated.View
        onTouchEnd={onPress}
        style={[
          {
            width: ORIGINAL_DOCUMENT_CARD_WIDTH,
            height: ORIGINAL_DOCUMENT_CARD_HEIGHT,
            borderRadius: 14,
            marginBottom: VERTICAL_MARGIN,
            backgroundColor: `rgb(${Math.floor(
              Math.random() * 256,
            )},${Math.floor(Math.random() * 256)},${Math.floor(
              Math.random() * 256,
            )})`,
            zIndex: idx,
          },
          animatedStyle,
        ]}
      ></Animated.View>
    )
  },
  (prev, next) => prev.isExpanded === next.isExpanded,
)

const CardStack = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null)
  //const scrollRef = useAnimatedRef<Animated.ScrollView>()

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
    <ScreenContainer>
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
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
          return (
            <Card
              key={n}
              idx={n}
              onPress={() => handlePress(n)}
              isExpanded={expandedId !== null ? n === expandedId + 1 : false}
            />
          )
        })}
      </Animated.ScrollView>
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
