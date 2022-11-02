import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  Animated,
  Dimensions,
  LayoutChangeEvent,
  PanResponder,
  View,
} from 'react-native'
import { usePrevious } from '~/hooks/generic'
import { useToasts } from '~/hooks/toasts'
import { Toast } from '~/types/toasts'
import { BOTTOM_PADDING } from './ToastContainer'

const SCREEN_HEIGHT = Dimensions.get('window').height
const EXTRA_PADDING = 10

type TStateUpdate = React.Dispatch<
  React.SetStateAction<Toast | null | undefined>
>

export const useAnimateLayoutToast = (setToastToShow: TStateUpdate) => {
  const { activeToast, removeToast } = useToasts()
  const prevActive = usePrevious(activeToast)

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
      animateToastOut(() => setToastToShow(null))
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

  return {
    animationStyles,
    handleContainerLayout,
    panResponder,
    interactionBtnRef,
  }
}
