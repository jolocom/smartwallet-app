import React, {
  useMemo,
  useRef,
  useState,
  useEffect,
  useLayoutEffect,
} from 'react'
import { RouteProp } from '@react-navigation/native'
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  LayoutRectangle,
  PanResponderGestureState,
  Dimensions,
  Easing,
  Platform,
} from 'react-native'
import MagicButton from '~/components/MagicButton'
import { useMagicBtnAnimations } from '~/hooks/magicButton'
import { useGoBack } from '~/hooks/navigation'
import { RootStackParamList } from '~/RootNavigation'
import { ScreenNames } from '~/types/screens'
import { Colors } from '~/utils/colors'
import AbsoluteBottom from '../../components/AbsoluteBottom'
import Btn, { BtnTypes } from '../../components/Btn'
import JoloText, {
  JoloTextKind,
  JoloTextWeight,
} from '../../components/JoloText'
import ScreenContainer from '../../components/ScreenContainer'
import BP from '~/utils/breakpoints'

const HOLE_DIAMETER = 100
const BALL_DIAMETER = 57
const SCREEN_HEIGHT = Dimensions.get('window').height
const NUM_OF_LINES = 4

interface IProps {
  route: RouteProp<RootStackParamList, ScreenNames.DragToConfirm>
}

const DragToConfirm: React.FC<IProps> = ({ route }) => {
  const { title, cancelText, instructionText, onComplete } = route?.params

  const goBack = useGoBack()

  const holeRef = useRef<View>(null)

  const [truncatedText, setTruncatedText] = useState('')

  const [isBallShown, setIsBallShown] = useState(true)
  const [holePosition, setHolePosition] = useState<LayoutRectangle | null>(null)
  const [areInstructionsVisible, setInstructionsVisibility] = useState(true)
  const [isBallOverTheHole, setIsBallOverTheHole] = useState(false)

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
          const hp = holePosition
          if (hp) {
            if (
              gesture.moveX > hp.x &&
              gesture.moveX < hp.x + hp.width &&
              gesture.moveY > hp.y &&
              gesture.moveY < hp.y + hp.height
            ) {
              setIsBallOverTheHole(true)
            } else {
              setIsBallOverTheHole(false)
            }
          }
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
    if (Platform.OS === 'android') {
      // eslint-disable-next-line
      holeRef.current?.measureInWindow((x, y, width, height) => {
        setHolePosition({ x, y, width, height })
      })
    } else {
      // eslint-disable-next-line
      holeRef.current?.measure((x, y, width, height) => {
        setHolePosition({ x, y, width, height })
      })
    }
  }

  useLayoutEffect(() => {
    setTimeout(() => {
      handleHoleLayout()
    }, 200)
  }, [])

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

  const {
    animatedValues,
    animateValues: { riseShadow, resetMagic },
  } = useMagicBtnAnimations(1200)

  useEffect(() => {
    if (isBallOverTheHole) {
      riseShadow.start()
    } else {
      resetMagic.start()
    }
  }, [isBallOverTheHole])

  const onTextLayout = (e) => {
    const { lines } = e.nativeEvent
    let text: string =
      lines.length <= NUM_OF_LINES
        ? lines
            .splice(0, NUM_OF_LINES)
            .map((line) => line.text)
            .join('')
        : lines
            .splice(0, NUM_OF_LINES)
            .map((line) => line.text)
            .join('')
            .slice(0, -4) + '...?'
    setTruncatedText(text)
  }

  return (
    <ScreenContainer
      backgroundColor={Colors.black}
      customStyles={{
        justifyContent: 'flex-start',
        paddingTop: BP({ default: 60, small: 32, xsmall: 24 }),
        paddingHorizontal: 36,
      }}
    >
      {truncatedText ? (
        <JoloText
          color={Colors.white90}
          kind={JoloTextKind.title}
          weight={JoloTextWeight.regular}
        >
          {truncatedText}
        </JoloText>
      ) : (
        <JoloText
          // @ts-expect-error
          onTextLayout={onTextLayout}
          color={Colors.white90}
          kind={JoloTextKind.title}
          weight={JoloTextWeight.regular}
        >
          {title}
        </JoloText>
      )}
      <Animated.View
        ref={holeRef}
        style={[
          styles.hole,
          styles.holeContainer,
          {
            transform: [{ scale: ballScale }],
          },
        ]}
      >
        <MagicButton animatedValues={animatedValues} />
      </Animated.View>

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
                {instructionText}
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
    paddingBottom: BP({ default: '20%', small: '10%', xsmall: '10%' }),
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
    borderWidth: 1,
  },
})

export default DragToConfirm
