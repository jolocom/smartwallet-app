import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
} from 'react-native'
import ScreenDismissArea from '../ScreenDismissArea'

type FallinFrom = 'top' | 'bottom'

interface IFallinProps {
  isFallingIn: boolean
  from: FallinFrom
  onDismiss: () => void
}

const SCREEN_HEIGHT = Dimensions.get('window').height

const Fallin: React.FC<IFallinProps> = ({
  children,
  isFallingIn,
  from,
  onDismiss,
}) => {
  const heightRef = useRef((from === 'top' ? -1 : 1) * 2.5 * SCREEN_HEIGHT)
  const positionRef = useRef(new Animated.Value(0)).current
  const [layoutDone, setLayoutDone] = useState(false)

  const handleLayout = (e: LayoutChangeEvent) => {
    if (!layoutDone) {
      heightRef.current = e.nativeEvent.layout.height
      if (from === 'bottom') {
        // setting sheet position below the screen height, to fall in from the bottom
        positionRef.setValue(SCREEN_HEIGHT + heightRef.current)
      } else {
        // setting sheet position above the screen height, to fall in from the top
        positionRef.setValue(-heightRef.current)
      }
      setLayoutDone(true)
    }
  }

  const animateSheet = (toValue: number) =>
    Animated.timing(positionRef, {
      toValue,
      duration: 500,
      useNativeDriver: true,
    })

  useEffect(() => {
    if (isFallingIn) {
      setTimeout(() => {
        animateSheet(0).start()
      }, 200)
    } else {
      animateSheet(
        from === 'bottom'
          ? SCREEN_HEIGHT + heightRef.current
          : -heightRef.current,
      ).start()
    }
  }, [isFallingIn])

  return (
    <Animated.View
      testID="top-sheet"
      onLayout={handleLayout}
      style={[styles.container, { transform: [{ translateY: positionRef }] }]}
    >
      {isFallingIn && children}
      <ScreenDismissArea onDismiss={onDismiss} />
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
})

export default Fallin
