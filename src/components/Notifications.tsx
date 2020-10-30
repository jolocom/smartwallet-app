import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { Colors } from '~/utils/colors'
import { JoloTextSizes } from '~/utils/fonts'
import JoloText, { JoloTextKind } from './JoloText'
import { useToasts } from '~/hooks/toasts'
import { ToastType } from '~/types/toasts'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

interface PropsI {
  title: string
  message: string
  type: ToastType
  isInteractive?: boolean
  onInteract?: () => void
}

const Notification: React.FC<PropsI> = ({
  title,
  message,
  type,
  onInteract,
}) => {
  const { top } = useSafeArea()

  const containerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current
  const containerOpacity = containerTranslateY.interpolate({
    inputRange: [-300, -50, 0],
    outputRange: [0, 0, 1],
  })

  useEffect(() => {
    Animated.timing(containerTranslateY, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start()
  }, [])

  const animationStyles = {
    transform: [{ translateY: containerTranslateY }],
    opacity: containerOpacity,
  }

  const handleInteract = useCallback(() => {
    Animated.timing(containerTranslateY, {
      toValue: -300,
      useNativeDriver: true,
    }).start(() => {
      onInteract && onInteract()
    })
  }, [JSON.stringify(containerTranslateY)])

  return (
    <TouchableWithoutFeedback onPress={handleInteract}>
      <Animated.View
        style={[
          styles.notificationContainer,
          { paddingTop: top + 20 },
          animationStyles,
        ]}
      >
        <JoloText
          kind={JoloTextKind.title}
          size={JoloTextSizes.mini}
          color={type === ToastType.info ? Colors.white : Colors.error}
        >
          {title}
        </JoloText>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={Colors.white}
        >
          {message}
        </JoloText>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default () => {
  const { activeToast, invokeInteract } = useToasts()

  return activeToast ? (
    <View style={styles.notifications}>
      <Notification
        key={activeToast.id}
        title={activeToast.title}
        message={activeToast.message}
        type={activeToast.type}
        onInteract={invokeInteract}
      />
    </View>
  ) : null
}

const styles = StyleSheet.create({
  notifications: {
    position: 'absolute',
    top: 0,
    width: SCREEN_WIDTH,
    zIndex: 100,
  },
  notificationContainer: {
    backgroundColor: Colors.black65,
    paddingBottom: 20,
    paddingHorizontal: 25,
  },
})
