import { RouteProp } from '@react-navigation/native'
import React, { useMemo, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  LayoutRectangle,
  PanResponderGestureState,
  Dimensions,
  Easing,
} from 'react-native'
import { useGoBack } from '~/hooks/navigation'
import { RootStackParamList } from '~/RootNavigation'
import { strings } from '~/translations'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import AbsoluteBottom from '../../components/AbsoluteBottom'
import Btn, { BtnTypes } from '../../components/Btn'
import JoloText, {
  JoloTextKind,
  JoloTextWeight,
} from '../../components/JoloText'
import ScreenContainer from '../../components/ScreenContainer'

const HOLE_DIAMETER = 99
const BALL_DIAMETER = 57
const SCREEN_HEIGHT = Dimensions.get('window').height

interface IProps {
  route: RouteProp<RootStackParamList, ScreenNames.DragTheBall>
}

const DragTheBall: React.FC<IProps> = ({ route }) => {
  const { title, cancelText, onComplete } = route?.params
  const goBack = useGoBack()

  const holeRef = useRef<View>(null)

  const [isBallShown, setIsBallShown] = useState(true)
  const [holePosition, setHolePosition] = useState<LayoutRectangle | null>(null)
  const [areInstructionsVisible, setInstructionsVisibility] = useState(true)

  const ball = useRef(new Animated.ValueXY()).current
  const ballScale = useRef(new Animated.Value(1)).current

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gesture) => {
          setInstructionsVisibility(false)
          Animated.event(
            [
              null,
              {
                dx: ball.x,
                dy: ball.y,
              },
            ],
            { useNativeDriver: false },
          )(e, gesture)
        },
        onPanResponderRelease: (e, gesture) => {
          if (isInHole(gesture)) {
            pullInBallHole()
          } else {
            Animated.timing(ball, {
              toValue: { x: 0, y: 0 },
              easing: Easing.bounce,
              useNativeDriver: false,
            }).start(() => {
              setInstructionsVisibility(true)
            })
          }
        },
      }),
    [JSON.stringify(holePosition)],
  )

  const handleHoleLayout = () => {
    holeRef.current?.measure((x, y, width, height, pageX, pageY) => {
      setHolePosition({ x, y, width, height })
    })
  }

  const pullInBallHole = () => {
    // 1. remove draggable ball
    setIsBallShown(false)
    // 2. Animate replacement ball with scale down
    Animated.timing(ballScale, {
      toValue: 0,
      easing: Easing.elastic(1),
      useNativeDriver: true,
    }).start(() => {
      onComplete()
      goBack()
    })
  }

  const isInHole = (gesture: PanResponderGestureState) => {
    const hp = holePosition
    if (hp) {
      return (
        gesture.moveX > hp.x &&
        gesture.moveX < hp.x + hp.width &&
        gesture.moveY > hp.y &&
        gesture.moveY < hp.y + hp.height
      )
    }
    return false
  }

  const holeCenter = {
    x: holePosition
      ? holePosition.x + holePosition?.width / 2 - BALL_DIAMETER / 2
      : 0,
    y: holePosition
      ? holePosition?.y + holePosition?.height / 2 - BALL_DIAMETER / 2
      : 0,
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
      >
        {title}
      </JoloText>
      <View
        style={styles.holeContainer}
        onLayout={handleHoleLayout}
        ref={holeRef}
      >
        <Animated.View
          style={[
            styles.hole,
            {
              transform: [{ scale: ballScale }],
            },
          ]}
        />
      </View>

      {!isBallShown ? (
        <View
          style={[
            styles.ballContainer,
            {
              position: 'absolute',
              top: holeCenter.y,
              left: holeCenter.x,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.ball,
              {
                transform: [{ scale: ballScale }],
              },
            ]}
          />
        </View>
      ) : null}

      <AbsoluteBottom>
        {isBallShown ? (
          <>
            {areInstructionsVisible ? (
              <JoloText
                color={Colors.white21}
                customStyles={{ marginBottom: 20 }}
              >
                {strings.DROP_THE_BALL}
              </JoloText>
            ) : null}
            <View style={styles.ballContainer} {...panResponder.panHandlers}>
              <Animated.View style={[ball.getLayout(), styles.ball]} />
            </View>
          </>
        ) : null}
        <Btn type={BtnTypes.secondary} onPress={goBack}>
          {cancelText}
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

export default DragTheBall
