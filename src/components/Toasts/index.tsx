import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  StyleSheet,
  View,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native'
import { useSafeArea } from 'react-native-safe-area-context'
import { Colors } from '~/utils/colors'
import { useToasts } from '~/hooks/toasts'
import { Toast, ToastType } from '~/types/toasts'
import { usePrevious } from '~/hooks/generic'
import { ToastToShowContext } from './context'
import NormalToast from './NormalToast'
import InteractiveToast from './InteractiveToast'
import StickyToast from './StickyToast'

const SCREEN_WIDTH = Dimensions.get('window').width
const SCREEN_HEIGHT = Dimensions.get('window').height
const BOTTOM_PADDING = 20
const EXTRA_PADDING = 10

const Toasts: React.FC = () => {
  const { activeToast, invokeInteract, removeToast } = useToasts()
  const prevActive = usePrevious(activeToast)
  const { top } = useSafeArea()

  const containerTranslateY = useRef(new Animated.Value(-SCREEN_HEIGHT)).current
  const containerOpacity = containerTranslateY.interpolate({
    inputRange: [-300, -50, 0],
    outputRange: [0, 0, 1],
  })

  const interactionBtnRef = useRef<View>(null)
  const [areaToAvoidPressing, setAreaToAvoidPressing] = useState({
    x0: 0,
    x1: 0,
    y0: 0,
    y1: 0,
  })
  const [interactionBtnDimensions, setInteractionBtnDimensions] = useState({
    x: 0,
    width: 0,
    height: 0,
  }) // doesn't include y here as the position regarding parent never changed and it shows stale -SCREEN_HEIGHT
  const [containerDimensions, setContainerDimensions] = useState({
    width: 0,
    height: 0,
  })

  /* Animation -> Start */
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (e, gestureEvent) => {
          const { x0, x1, y0, y1 } = areaToAvoidPressing
          // if it is not a interactionBtn
          if (
            activeToast &&
            activeToast.interact &&
            gestureEvent.x0 > x0 &&
            gestureEvent.x0 < x1 &&
            gestureEvent.y0 > y0 &&
            gestureEvent.y0 < y1
          ) {
            // if this is the area if an interaction btn
          } else {
            // if swipe direction is up
            if (gestureEvent.dy < 0) {
              Animated.event([null, { dy: containerTranslateY }], {
                useNativeDriver: false,
              })(e, gestureEvent)
            }
          }
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
    [JSON.stringify(activeToast), JSON.stringify(areaToAvoidPressing)],
  )

  const animateToast = (toValue: number) => {
    return (cb = () => {}) => {
      Animated.timing(containerTranslateY, {
        toValue: toValue,
        useNativeDriver: true,
      }).start(cb)
    }
  }

  const animateToastIn = animateToast(0)

  const animateToastOut = animateToast(-SCREEN_HEIGHT)

  useEffect(() => {
    if (activeToast && !prevActive) {
      // this is for the first time we show toast
      setToastToShow(activeToast)
      animateToastIn()
    }
    if (!activeToast && prevActive) {
      // this is for the last time we show toast: we want to show the value of a toast therefore using prevActive value
      setToastToShow(prevActive)
      animateToastOut()
    } else if (activeToast && prevActive) {
      // this is when we change toast from one to another
      // 1. We first show the old toast and when animation hiding the old toast complete
      setToastToShow(prevActive)
      animateToastOut(() => {
        // 2. We change value of the toast to show to active toast
        setToastToShow(activeToast)
        // 3. And run animation to show it
        animateToastIn()
      })
    }
  }, [JSON.stringify(activeToast)])

  const animationStyles = {
    transform: [{ translateY: containerTranslateY }],
    opacity: containerOpacity,
  }
  /* Animation -> End */

  /* AreaToAvoidPressing -> Start */

  const handleInteractionBtnLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (activeToast && !activeToast.interact) return
      if (interactionBtnRef?.current) {
        interactionBtnRef.current.measure((fx, fy, width, height, px, py) => {
          setInteractionBtnDimensions({
            x: px,
            width,
            height,
          })
        })
      }
    },
    [JSON.stringify(activeToast)],
  )

  const handleContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      if (activeToast && !activeToast.interact) return
      setContainerDimensions({
        width: e.nativeEvent.layout.width,
        height: e.nativeEvent.layout.height,
      })
    },
    [JSON.stringify(activeToast)],
  )

  useEffect(() => {
    setAreaToAvoidPressing({
      x0: interactionBtnDimensions.x - EXTRA_PADDING,
      x1:
        interactionBtnDimensions.x +
        interactionBtnDimensions.width +
        EXTRA_PADDING,
      y0:
        containerDimensions.height -
        BOTTOM_PADDING -
        interactionBtnDimensions.height -
        EXTRA_PADDING,
      y1: containerDimensions.height - BOTTOM_PADDING + EXTRA_PADDING,
    })
  }, [
    JSON.stringify(containerDimensions),
    JSON.stringify(interactionBtnDimensions),
  ])
  /* AreaToAvoidPressing -> End */

  /* Context value that will be share with consumern -> Start */
  const [toastToShow, setToastToShow] = useState<Toast | null | undefined>(
    activeToast,
  )

  const toastColor = toastToShow
    ? toastToShow.type === ToastType.info && toastToShow.dismiss
      ? Colors.white
      : Colors.error
    : Colors.error

  const memoizedContextValue = useMemo(
    () => ({
      toastToShow,
      toastColor,
      invokeInteract,
      isNormal: !!(toastToShow?.dismiss && !toastToShow?.interact) ?? false,
      isInteractive: !!(toastToShow?.interact && toastToShow.dismiss) ?? false,
      isSticky: !toastToShow?.dismiss,
    }),
    [JSON.stringify(toastToShow), invokeInteract],
  )
  /* Context value that will be share with consumern -> End */

  return (
    <Animated.View
      style={[
        {
          paddingTop: top + 20,
          backgroundColor: Colors.black65,
        },
        animationStyles,
      ]}
      onLayout={handleContainerLayout}
    >
      <View
        {...panResponder.panHandlers}
        style={{ paddingHorizontal: 25, paddingBottom: BOTTOM_PADDING }}
      >
        <ToastToShowContext.Provider value={memoizedContextValue}>
          {/* Toast with title and description only */}
          <NormalToast />
          {/* Toast with interaction btn */}
          <InteractiveToast
            ref={interactionBtnRef}
            handleInteractionBtnLayout={handleInteractionBtnLayout}
          />
          {/* Sticky Toast without interaction btn */}
          <StickyToast />
        </ToastToShowContext.Provider>
      </View>
    </Animated.View>
  )
}

export default () => {
  const { activeToast } = useToasts()

  if (!activeToast) {
    return null
  }
  return (
    <View style={styles.notifications}>
      <Toasts />
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
})
