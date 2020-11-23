import React, { useMemo, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponderGestureState,
  Dimensions,
} from 'react-native'
import { useGoBack } from '~/hooks/navigation'
import { strings } from '~/translations'
import { Colors } from '~/utils/colors'
import AbsoluteBottom from './AbsoluteBottom'
import Btn, { BtnTypes } from './Btn'
import JoloText, { JoloTextKind, JoloTextWeight } from './JoloText'
import ScreenContainer from './ScreenContainer'

const HOLE_DIAMETER = 99
const BALL_DIAMETER = 57
const SCREEN_HEIGHT = Dimensions.get('window').height

const DragBall = ({ route }) => {
  const { documentName = strings.DOCUMENT } = route?.params
  const goBack = useGoBack()
  const holeRef = useRef<View>(null)
  const [isBallShown, setIsBallShown] = useState(true)
  const [isBallOverTheHole, setIsBallOverTheHole] = useState(false)
  const [holePosition, setHolePosition] = useState<LayoutRectangle | null>(null)
  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
          Animated.event(
            [
              null,
              {
                dx: pan.x,
                dy: pan.y,
              },
            ],
            { useNativeDriver: false },
          )(e, gesture)
          const dz = holePosition
          if (dz) {
            if (
              gesture.moveX > dz.x &&
              gesture.moveX < dz.x + dz.width &&
              gesture.moveY > dz.y &&
              gesture.moveY < dz.y + dz.height
            ) {
              setIsBallOverTheHole(true)
            } else {
              setIsBallOverTheHole(false)
            }
          }
        },
        onPanResponderRelease: (e, gesture) => {
          if (isInHole(gesture)) {
            setIsBallShown(false)
          } else {
            Animated.spring(pan, {
              toValue: { x: 0, y: 0 },
              useNativeDriver: false,
              tension: 10,
              friction: 1.5,
            }).start()
          }
        },
      }),
    [JSON.stringify(holePosition)],
  )

  const handleHoleLayout = (event: LayoutChangeEvent) => {
    holeRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setHolePosition({ x, y, width, height })
    })
  }

  const isInHole = (gesture: PanResponderGestureState) => {
    const dz = holePosition
    if (dz) {
      return (
        gesture.moveX > dz.x &&
        gesture.moveX < dz.x + dz.width &&
        gesture.moveY > dz.y &&
        gesture.moveY < dz.y + dz.height
      )
    }
    return false
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.black}
      customStyles={{ justifyContent: 'flex-start' }}
    >
      <JoloText
        color={Colors.white90}
        kind={JoloTextKind.title}
        weight={JoloTextWeight.regular}
      >{`${strings.DO_YOU_WANT_TO_DELETE} ${documentName}?`}</JoloText>
      <View
        style={styles.holeContainer}
        onLayout={handleHoleLayout}
        ref={holeRef}
      >
        <View
          style={[
            styles.hole,
            {
              ...(isBallOverTheHole && { backgroundColor: Colors.activity }),
            },
          ]}
        />
      </View>

      <AbsoluteBottom>
        {isBallShown ? (
          <>
            <JoloText
              color={Colors.white21}
              customStyles={{ marginBottom: 20 }}
            >
              {strings.DROP_THE_BALL}
            </JoloText>
            <View style={styles.ballContainer} {...panResponder.panHandlers}>
              <Animated.View style={[pan.getLayout(), styles.ball]} />
            </View>
          </>
        ) : null}
        <Btn type={BtnTypes.secondary} onPress={goBack}>
          {strings.CANCEL}
        </Btn>
      </AbsoluteBottom>
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  ballContainer: {
    alignSelf: 'center',
  },
  ball: {
    width: BALL_DIAMETER,
    height: BALL_DIAMETER,
    borderRadius: BALL_DIAMETER / 2,
    backgroundColor: Colors.white,
  },
  holeContainer: {
    marginTop: SCREEN_HEIGHT * 0.15,
  },
  hole: {
    width: HOLE_DIAMETER,
    height: HOLE_DIAMETER,
    borderRadius: HOLE_DIAMETER / 2,
    borderColor: Colors.success,
    borderWidth: 1,
  },
})

export default DragBall
