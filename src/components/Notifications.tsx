import React, { useEffect, useMemo, useRef } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
  PanResponder,
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
  const { activeToast, invokeInteract, removeToast } = useToasts()

  const { top } = useSafeArea()

  const prevActive = usePrevious(activeToast)

  const containerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT / 2))
    .current
  const containerOpacity = containerTranslateY.interpolate({
    inputRange: [-300, -50, 0],
    outputRange: [0, 0, 1],
  })

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureEvent) => {
          Animated.event([null, { dy: containerTranslateY }], {
            useNativeDriver: false,
          })(e, gestureEvent)
        },
        onPanResponderRelease: (e, gesture) => {
          if (activeToast) {
            if (gesture.dy < 0 && activeToast.dismiss) {
              removeToast(activeToast)
            } else {
              Animated.timing(containerTranslateY, {
                toValue: 0,
                duration: 100,
                useNativeDriver: true,
              }).start()
            }
          }
        },
      }),
    [JSON.stringify(activeToast)],
  )

  const toastToShow = activeToast ? activeToast : prevActive ? prevActive : null
  const toastColor = toastToShow
    ? toastToShow.type === ToastType.info
      ? Colors.white
      : Colors.error
    : Colors.white

  useEffect(() => {
    if (activeToast && !prevActive) {
      Animated.timing(containerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start()
    }
    if (!activeToast && prevActive) {
      Animated.timing(containerTranslateY, {
        toValue: -SCREEN_HEIGHT / 2,
        useNativeDriver: true,
      }).start()
    } else if (activeToast && prevActive) {
      Animated.sequence([
        Animated.timing(containerTranslateY, {
          toValue: -SCREEN_HEIGHT / 2,
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
    <Animated.View
      style={[
        styles.notificationContainer,
        { ...(!toastToShow.interact && { paddingHorizontal: 25 }) },
        { paddingTop: top + 20 },
        animationStyles,
      ]}
    >
      <View
        style={toastToShow.interact && styles.withInteractContainer}
        {...panResponder.panHandlers}
      >
        <View style={toastToShow.interact && styles.withInteractText}>
          <JoloText
            kind={JoloTextKind.title}
            size={JoloTextSizes.mini}
            color={toastColor}
            customStyles={{
              letterSpacing: 0.09,
              ...(toastToShow.interact && { textAlign: 'left' }),
            }}
          >
            {toastToShow.title}
          </JoloText>
          <JoloText
            kind={JoloTextKind.subtitle}
            size={JoloTextSizes.tiniest}
            color={Colors.white}
            customStyles={toastToShow.interact && { textAlign: 'left' }}
          >
            {toastToShow.message}
          </JoloText>
        </View>
        <View style={styles.interactBtnContainer}>
          {toastToShow.interact && toastToShow.interact.label ? (
            <TouchableOpacity
              onPress={invokeInteract}
              style={styles.interactBtn}
            >
              <JoloText
                kind={JoloTextKind.subtitle}
                size={JoloTextSizes.tiniest}
                color={toastColor}
                customStyles={{
                  fontSize: 12,
                  letterSpacing: 0.8,
                  lineHeight: 6.4,
                }}
              >
                {toastToShow.interact.label}
              </JoloText>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </Animated.View>
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
  },
  withInteractContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 25,
  },
  withInteractText: { alignItems: 'flex-start', flex: 0.6 },
  interactBtnContainer: {
    flex: 0.3,
    alignSelf: 'flex-end',
  },
  interactBtn: {
    paddingTop: 9,
    paddingBottom: 6,

    borderWidth: 1,
    borderColor: Colors.silverChalice,
    borderRadius: 6.4,
  },
})
