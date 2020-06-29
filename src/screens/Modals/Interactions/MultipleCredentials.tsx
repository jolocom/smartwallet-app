import React, { useRef, useState, useCallback } from 'react'
import ActionSheet from 'react-native-actions-sheet'
import {
  StyleSheet,
  Dimensions,
  View,
  PanResponder,
  Animated,
  ScrollView,
  Easing,
  LayoutAnimation,
} from 'react-native'

import { Colors } from '~/utils/colors'
import InteractionFooter from './InteractionFooter'
import InteractionHeader from './InteractionHeader'
import AbsoluteBottom from '~/components/AbsoluteBottom'
import Paragraph, { ParagraphSizes } from '~/components/Paragraph'
import { strings } from '~/translations/strings'
import useDelay from '~/hooks/useDelay'

interface PropsI {
  ctaText: string
  title: string
  description: string
}

interface CardPropsI {
  onToggleSelect: () => void
  onToggleScroll: (value: boolean) => void
}

const CLAIMS = [
  { id: '1', isSelected: false },
  { id: '2', isSelected: false },
  { id: '3', isSelected: false },
]

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
const SWIPE_THRESHOLD = 1
const WINDOW = Dimensions.get('window')
const SCREEN_WIDTH = WINDOW.width
const SCREEN_HEIGHT = WINDOW.height

const Card: React.FC<CardPropsI> = React.memo(
  ({ onToggleSelect, onToggleScroll }) => {
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
          position.setValue({ x: gesture.dx, y: gesture.dy })

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
        onToggleSelect()
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
          <View style={styles.card} />
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
const MultipleCredentials: React.FC<PropsI> = React.forwardRef(
  ({ ctaText, title, description }, ref) => {
    const [claims, setClaims] = useState(CLAIMS)
    const [isScrollEnabled, setIsScrollEnabled] = useState(true)

    const handleClaimToggle = useCallback((id: string) => {
      setClaims((prevState) => {
        return prevState.map((claim) =>
          claim.id === id ? { ...claim, isSelected: !claim.isSelected } : claim,
        )
      })
    }, [])

    const handletoggleScroll = (value: boolean) => {
      setIsScrollEnabled(value)
    }

    const hideActionSheet = () => {
      ref.current?.setModalVisible(false)
    }
    return (
      <ActionSheet
        ref={ref}
        containerStyle={styles.container}
        footerAlwaysVisible
      >
        <View style={styles.headerWrapper}>
          <InteractionHeader title={title} description={description} />
        </View>
        <ScrollView
          directionalLockEnabled
          scrollEnabled={isScrollEnabled}
          contentContainerStyle={styles.listContainer}
        >
          {claims.map((claim) => (
            <Card
              key={claim.id}
              onToggleSelect={() => handleClaimToggle(claim.id)}
              onToggleScroll={handletoggleScroll}
            />
          ))}
        </ScrollView>
        <AbsoluteBottom customStyles={styles.btns}>
          <InteractionFooter
            hideActionSheet={hideActionSheet}
            ctaText={ctaText}
          />
        </AbsoluteBottom>
      </ActionSheet>
    )
  },
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: SCREEN_HEIGHT,
    paddingTop: 32,
    paddingBottom: 0,
    backgroundColor: Colors.mainBlack,
  },
  headerWrapper: {
    paddingHorizontal: 39,
  },
  btns: {
    width: '100%',
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
    paddingVertical: 26,
    bottom: 0,
  },
  listContainer: {
    flex: 1,
    paddingBottom: 80,
    paddingHorizontal: 20,
  },
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

export default MultipleCredentials
