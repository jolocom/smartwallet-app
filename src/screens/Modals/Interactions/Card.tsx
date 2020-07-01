import React, { useRef, useState } from 'react'
import {
  PanResponder,
  Easing,
  LayoutAnimation,
  Animated,
  View,
  StyleSheet,
  Dimensions,
} from 'react-native'

const SWIPE_THRESHOLD = 1

import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import useDelay from '~/hooks/useDelay'
import { Colors } from '~/utils/colors'

interface CardPropsI {
  isFull?: boolean
}

export const Card: React.FC<CardPropsI> = ({ children, isFull }) => {
  return (
    <View style={[styles.card, isFull && { width: '100%', height: '63%' }]}>
      {children}
    </View>
  )
}

interface AnimatedCardPropsI {
  onToggleScroll: (value: boolean) => void
}
const MEASURES = [
  {
    name: 'forPullRight',
    marginAfterAction: 10,
    scale: 1.25,
    startX: 26,
    bounceTimes: 4,
  },
  {
    name: 'forPullLeft',
    marginAfterAction: -10,
    scale: 1,
    startX: 0,
    bounceTimes: 2,
  },
]
const WINDOW = Dimensions.get('window')
const SCREEN_WIDTH = WINDOW.width
const SCREEN_HEIGHT = WINDOW.height

const AnimatedCard: React.FC<AnimatedCardPropsI> = React.memo(
  ({ onToggleScroll, children }) => {
    const position = useRef(new Animated.ValueXY()).current
    const scale = useRef(new Animated.Value(1)).current
    const instructionOpacity = useRef(new Animated.Value(1)).current

    const [isInteracted, setIsInteracted] = useState(false)

    const [margin, setMargin] = useState(MEASURES[1].marginAfterAction)

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: (event, gesture) => {
          // we are setting position manually here,
          // as we want the card to follow user fingers
          if (
            (gesture.dx > 0 && !isInteracted) ||
            (gesture.dx < 0 && isInteracted)
          ) {
            position.setValue({ x: gesture.dx, y: gesture.dy })
          }

          onToggleScroll(false)
          if (gesture.dx > SWIPE_THRESHOLD) {
            if (!isInteracted) {
              setIsInteracted(true)
              pullRight()
            }
          }
          if (gesture.dx < -SWIPE_THRESHOLD) {
            setIsInteracted(false)
            pullLeft()
          }
          return true
        },
        onPanResponderRelease: (event, gesture) => {
          const [pullRight, pullLeft] = MEASURES
          if (gesture.dx < SWIPE_THRESHOLD && gesture.dx > 0 && isInteracted) {
            resetPosition(pullLeft.startX)
            onToggleScroll(true)
          } else if (
            gesture.dx > -SWIPE_THRESHOLD &&
            gesture.dx < 0 &&
            !isInteracted
          ) {
            resetPosition(pullRight.startX)
            onToggleScroll(true)
          }
          return true
        },
      }),
    ).current

    const resetPosition = (x: number) => {
      Animated.spring(position, {
        toValue: { x, y: 0 },
        useNativeDriver: true,
      }).start()
    }

    const pull = (direction: 'right' | 'left') => {
      return () => {
        const [pullRight, pullLeft] = MEASURES
        const isPullRight = direction === 'right'
        // TODO: select credential here as well
        Animated.sequence([
          Animated.parallel([
            Animated.timing(position, {
              toValue: {
                x: isPullRight ? pullRight.startX : pullLeft.startX,
                y: 0,
              },
              easing: Easing.elastic(
                isPullRight ? pullRight.bounceTimes : pullLeft.bounceTimes,
              ),
              useNativeDriver: true,
            }),
            Animated.timing(instructionOpacity, {
              toValue: isPullRight ? 0 : 1,
              duration: isPullRight ? 0 : 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.spring(scale, {
            toValue: isPullRight ? pullRight.scale : pullLeft.scale,
            useNativeDriver: true,
          }),
        ]).start(async () => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)
          onToggleScroll(true)
          await useDelay(
            () => {
              setMargin(
                isPullRight
                  ? pullRight.marginAfterAction
                  : pullLeft.marginAfterAction,
              )
            },
            isPullRight ? 590 : 900,
          )
        })
      }
    }

    const pullRight = pull('right')
    const pullLeft = pull('left')

    const getCardStyle = () => {
      return {
        transform: [{ scale }, position.getTranslateTransform()[0]],
      }
    }

    return (
      <View style={[styles.cardContainer, { marginVertical: margin }]}>
        <Animated.View style={getCardStyle()} {...panResponder.panHandlers}>
          <Card>{children}</Card>
        </Animated.View>
        <Animated.View
          style={[styles.instruction, { opacity: instructionOpacity }]}
        >
          <Paragraph size={ParagraphSizes.micro} color={Colors.white45}>
            {strings.PULL_TO_CHOOSE}
          </Paragraph>
        </Animated.View>
      </View>
    )
  },
)

const styles = StyleSheet.create({
  cardContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    paddingVertical: 20,
  },
  card: {
    width: SCREEN_WIDTH * 0.64,
    height: SCREEN_HEIGHT * 0.22,
    borderRadius: 10,
    backgroundColor: Colors.activity,
  },
  instruction: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    justifyContent: 'center',
    width: 70,
    paddingHorizontal: 10,
  },
})

export default AnimatedCard
