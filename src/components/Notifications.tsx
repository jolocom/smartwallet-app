import React, { useCallback, useEffect, useRef } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
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
import { usePrevious } from '~/hooks/generic'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height

const Notification: React.FC = () => {
  const { activeToast } = useToasts()
  const { top } = useSafeArea()

  const prevActive = usePrevious(activeToast)
  console.log({ prevActive })

  const containerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current
  const containerOpacity = containerTranslateY.interpolate({
    inputRange: [-300, -50, 0],
    outputRange: [0, 0, 1],
  })

  const toastToShow = activeToast ? activeToast : prevActive ? prevActive : null

  useEffect(() => {
    console.log({ activeToast })
    if (activeToast && !prevActive) {
      Animated.timing(containerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
    if (!activeToast && prevActive) {
      Animated.timing(containerTranslateY, {
        toValue: -SCREEN_HEIGHT,
        useNativeDriver: true,
      }).start()
    } else if (activeToast && prevActive) {
      Animated.sequence([
        Animated.timing(containerTranslateY, {
          toValue: -SCREEN_HEIGHT,
          useNativeDriver: true,
        }),
        Animated.timing(containerTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [JSON.stringify(activeToast)])

  const animationStyles = {
    transform: [{ translateY: containerTranslateY }],
    opacity: containerOpacity,
  }

  if (!toastToShow) return null
  return (
    <TouchableWithoutFeedback onPress={() => {}}>
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
          color={
            toastToShow.type === ToastType.info ? Colors.white : Colors.error
          }
        >
          {toastToShow.title}
        </JoloText>
        <JoloText
          kind={JoloTextKind.subtitle}
          size={JoloTextSizes.tiniest}
          color={Colors.white}
        >
          {toastToShow.message}
        </JoloText>
      </Animated.View>
    </TouchableWithoutFeedback>
  )
}

export default () => {
  return (
    <View style={styles.notifications}>
      <Notification />
    </View>
  )
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
