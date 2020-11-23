import React, { useMemo, useRef, useState } from 'react'
import {
  StyleSheet,
  View,
  Animated,
  PanResponder,
  LayoutChangeEvent,
  LayoutRectangle,
  PanResponderGestureState,
} from 'react-native'
import { debugView } from '~/utils/dev'
import ScreenContainer from './ScreenContainer'

const HOLE_RADIUS = 35
const SMALL_BALL_RADIUS = 25

const DragBall = () => {
  const holeRef = useRef<View>(null)
  const [isBallShown, setIsBallShown] = useState(true)
  const [holePosition, setHolePosition] = useState<LayoutRectangle | null>(null)
  const pan = useRef(new Animated.ValueXY()).current
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: Animated.event(
          [
            null,
            {
              dx: pan.x,
              dy: pan.y,
            },
          ],
          { useNativeDriver: false },
        ),
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
    <ScreenContainer customStyles={{ justifyContent: 'space-around' }}>
      <View
        style={styles.holeContainer}
        onLayout={handleHoleLayout}
        ref={holeRef}
      >
        <View style={styles.hole} />
      </View>
      {isBallShown ? (
        <View style={styles.ballContainer} {...panResponder.panHandlers}>
          <Animated.View style={[pan.getLayout(), styles.ball]} />
        </View>
      ) : null}
    </ScreenContainer>
  )
}

const styles = StyleSheet.create({
  ballContainer: {
    position: 'absolute',
    top: 500,
    left: 100,
  },
  ball: {
    width: SMALL_BALL_RADIUS * 2,
    height: SMALL_BALL_RADIUS * 2,
    borderRadius: SMALL_BALL_RADIUS,
    ...debugView(),
  },
  holeContainer: {
    position: 'absolute',
    top: 200,
    left: 100,
    ...debugView(),
  },
  hole: {
    width: HOLE_RADIUS * 2,
    height: HOLE_RADIUS * 2,
    borderRadius: HOLE_RADIUS,
    ...debugView(),
  },
})

export default DragBall
