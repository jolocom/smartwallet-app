import React, { useRef, useEffect } from 'react'
import {
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import { Colors } from '~/utils/colors'

interface Props {
  isVisible: boolean
  customStyles?: ViewStyle
}

const TopSheet: React.FC<Props> = ({
  isVisible,
  children,
  customStyles = {},
}) => {
  const { top } = useSafeArea()
  const heightRef = useRef(0)
  const positionRef = useRef(new Animated.Value(-heightRef.current)).current

  const handleLayout = (e: LayoutChangeEvent) => {
    heightRef.current = e.nativeEvent.layout.height
  }

  const animateSheet = (toValue: number) =>
    Animated.timing(positionRef, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    })

  useEffect(() => {
    if (isVisible) {
      animateSheet(0).start()
    } else {
      animateSheet(-heightRef.current - top).start()
    }
  }, [isVisible])

  return (
    <Animated.View
      testID="top-sheet"
      onLayout={handleLayout}
      style={[
        styles.container,
        customStyles,
        { transform: [{ translateY: positionRef }], paddingTop: top },
      ]}
    >
      {children}
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    width: '100%',
    backgroundColor: Colors.lightBlack,
    padding: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    zIndex: 1,
  },
})

export default TopSheet
