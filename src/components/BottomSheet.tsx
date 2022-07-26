import React, { useEffect, useRef, useState } from 'react'
import { StyleSheet, View, Animated } from 'react-native'
import { IWithCustomStyle } from '~/types/props'
import { Colors } from '~/utils/colors'
import { SCREEN_HEIGHT } from '~/utils/dimensions'
import ScreenDismissArea from './ScreenDismissArea'

interface BottomSheetProps extends IWithCustomStyle {
  onDismiss?: () => void
  visible?: boolean
}

// NOTE: the hight of the sheet will depend on the children
const BottomSheet: React.FC<BottomSheetProps> = ({
  children,
  onDismiss,
  customStyles,
  visible = true,
}) => {
  const positionValue = useRef(new Animated.Value(SCREEN_HEIGHT)).current
  const [overlayVisible, setOverlayVisible] = useState(visible ? true : false)

  const animatePosition = (value: number) =>
    Animated.timing(positionValue, {
      duration: 400,
      toValue: value,
      useNativeDriver: true,
    })

  useEffect(() => {
    if (visible) {
      animatePosition(0).start()
      setOverlayVisible(true)
    } else {
      animatePosition(SCREEN_HEIGHT).start(() => {
        setOverlayVisible(false)
      })
    }
  }, [visible])

  return !overlayVisible ? null : (
    <View style={styles.fullScreen}>
      <ScreenDismissArea onDismiss={onDismiss} />
      <Animated.View
        style={[
          styles.interactionBody,
          customStyles,
          { transform: [{ translateY: positionValue }] },
        ]}
      >
        {children}
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  fullScreen: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.black65,
  },
  interactionBody: {
    //flex: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
})

export default BottomSheet
