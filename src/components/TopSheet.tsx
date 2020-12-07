import React, { useRef, useEffect } from 'react'
import {
  Animated,
  StyleSheet,
  ViewStyle,
  LayoutChangeEvent,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'

import ActionSheet from './ActionSheet/ActionSheet'
import { Colors } from '~/utils/colors'

interface Props {
  isVisible: boolean
  onClose: () => void
  customStyles?: ViewStyle
}

const TopSheet: React.FC<Props> = ({
  isVisible,
  children,
  customStyles = {},
  onClose,
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
      animateSheet(-heightRef.current).start()
    }
  }, [isVisible])

  return (
    <ActionSheet animationType="fade" isVisible={isVisible} onClose={onClose}>
      <Animated.View
        onLayout={handleLayout}
        style={[
          styles.container,
          customStyles,
          { transform: [{ translateY: positionRef }], paddingTop: top },
        ]}
      >
        {children}
      </Animated.View>
    </ActionSheet>
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
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
})

export default TopSheet
