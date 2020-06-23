import React, { useRef, useState } from 'react'
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

interface PropsI {
  ctaText: string
  title: string
  description: string
}

const CLAIMS = [{ id: '1' }, { id: '2' }, { id: '3' }]
const SWIPE_THRESHOLD = 20

const HEIGHT = Dimensions.get('window').height

const Card = () => {
  const position = useRef(new Animated.ValueXY()).current
  const scale = useRef(new Animated.Value(1)).current
  const [cardHeight, setHeight] = useState(170)

  const [isInstructionVisible, setIsInstructionVisible] = useState(true)

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
      onPanResponderMove: (event, gesture) => {
        // we are setting position manually here,
        // as we want the card to follow user fingers
        position.setValue({ x: gesture.dx, y: 0 })
        if (gesture.dx > SWIPE_THRESHOLD) {
          pullRight(gesture.dx)
        }
      },
      onPanResponderRelease: (event, gesture) => {
        if (gesture.dx < SWIPE_THRESHOLD) {
          resetPosition()
        }
      },
    }),
  ).current

  const resetPosition = () => {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: true,
    }).start()
  }

  const handleHideInstruction = () => {
    setIsInstructionVisible(false)
  }

  const pullRight = (x: number) => {
    handleHideInstruction()
    Animated.sequence([
      Animated.timing(position, {
        toValue: { x: 0, y: 0 },
        easing: Easing.bounce,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1.25,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setHeight(215)
    })
  }

  const getCardStyle = () => {
    return {
      transform: [{ scale }, position.getTranslateTransform()[0]],
    }
  }

  return (
    <View style={[styles.cardContainer, { height: cardHeight }]}>
      <Animated.View style={[getCardStyle()]} {...panResponder.panHandlers}>
        <View style={styles.card}></View>
      </Animated.View>
      {isInstructionVisible && (
        <View style={styles.instruction}>
          <Paragraph size={ParagraphSizes.micro} color={Colors.white45}>
            {strings.PULL_TO_CHOOSE}
          </Paragraph>
        </View>
      )}
    </View>
  )
}

const MultipleCredentials: React.FC<PropsI> = React.forwardRef(
  ({ ctaText, title, description }, ref) => {
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
          contentContainerStyle={{ paddingBottom: 80 }}
          disableScrollViewPanResponder
        >
          {CLAIMS.map((claim) => (
            <Card key={claim.id} />
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
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  card: {
    position: 'absolute',
    width: 268,
    height: 170,
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
