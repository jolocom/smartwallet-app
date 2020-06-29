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
const MARGIN = -10
const MARGIN_SCALED = 10
const SWIPE_THRESHOLD = 1
const WINDOW = Dimensions.get('window')
const SCREEN_WIDTH = WINDOW.width
const SCREEN_HEIGHT = WINDOW.height

const HEIGHT = Dimensions.get('window').height

const Card: React.FC<CardPropsI> = React.memo(
  ({ onToggleSelect, onToggleScroll }) => {
    const position = useRef(new Animated.ValueXY()).current
    const scale = useRef(new Animated.Value(1)).current

    const [isInteracted, setIsInteracted] = useState(false)

    const [margin, setMargin] = useState(MARGIN)

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
        onMoveShouldSetPanResponder: (evt, gestureState) => true,
        onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
        onPanResponderMove: (event, gesture) => {
          // we are setting position manually here,
          // as we want the card to follow user fingers555
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
          if (gesture.dx < SWIPE_THRESHOLD && gesture.dx > 0 && isInteracted) {
            resetPosition(0)
            onToggleScroll(true)
          } else if (
            gesture.dx > -SWIPE_THRESHOLD &&
            gesture.dx < 0 &&
            !isInteracted
          ) {
            resetPosition(26)
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
        onToggleSelect()
        Animated.sequence([
          Animated.timing(position, {
            toValue: { x: direction === 'right' ? 26 : 0, y: 0 },
            easing: Easing.elastic(4),
            useNativeDriver: true,
          }),
          Animated.spring(scale, {
            toValue: direction === 'right' ? 1.25 : 1,
            useNativeDriver: true,
          }),
        ]).start(async () => {
          onToggleScroll(true)
          await useDelay(
            () => setMargin(direction === 'right' ? MARGIN_SCALED : MARGIN),
            590,
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
      <View
        style={[
          styles.cardContainer,
          {
            justifyContent: 'center',
            paddingVertical: 20,
            marginVertical: margin,
          },
        ]}
      >
        <Animated.View style={getCardStyle()} {...panResponder.panHandlers}>
          <View style={styles.card} />
        </Animated.View>
        {!isInteracted && (
          <View style={styles.instruction}>
            <Paragraph size={ParagraphSizes.micro} color={Colors.white45}>
              {strings.PULL_TO_CHOOSE}
            </Paragraph>
          </View>
        )}
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
          contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 20 }}
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
    height: HEIGHT,
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
    borderColor: 'green',
    borderWidth: 2,
  },
  cardContainer: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  card: {
    width: SCREEN_WIDTH * 0.64,
    height: SCREEN_HEIGHT * 0.22,
    borderRadius: 10,
    backgroundColor: Colors.activity,
  },
  instruction: {
    position: 'absolute',
    right: 8,
    top: '35%',
    width: 70,
    paddingHorizontal: 10,
  },
})

export default MultipleCredentials
