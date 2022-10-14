import React, { useMemo, useState } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { Colors } from '~/utils/colors'
import { useToasts } from '~/hooks/toasts'
import { Toast, ToastType } from '~/types/toasts'
import { ToastToShowContext } from './context'
import NormalToast from './NormalToast'
import InteractiveToast from './InteractiveToast'
import StickyToast from './StickyToast'
import { useAnimateLayoutToast } from './useAnimateToast'

const SCREEN_WIDTH = Dimensions.get('window').width

const Toasts: React.FC = () => {
  const { activeToast, invokeInteract, removeToast } = useToasts()

  /* Context value that will be share with consumers -> Start */
  const [toastToShow, setToastToShow] = useState<Toast | null | undefined>(
    activeToast,
  )

  const {
    animationStyles,
    panResponder,
    interactionBtnRef,
    handleContainerLayout,
    handleInteractionBtnLayout,
  } = useAnimateLayoutToast(setToastToShow)

  const toastColor = toastToShow
    ? toastToShow.type === ToastType.info && toastToShow.dismiss
      ? Colors.white
      : toastToShow.type === ToastType.success
      ? Colors.success
      : Colors.error
    : Colors.error

  const handleToastInvoke = () => {
    invokeInteract()
    activeToast && removeToast(activeToast)
  }

  const memoizedContextValue = useMemo(
    () => ({
      toastToShow,
      toastColor,
      invokeInteract: handleToastInvoke,
      isNormal: !!(toastToShow?.dismiss && !toastToShow?.interact),
      isInteractive: !!(toastToShow?.interact && toastToShow.dismiss),
      isSticky: !!(toastToShow && !toastToShow?.dismiss),
    }),
    [JSON.stringify(toastToShow), invokeInteract],
  )
  /* Context value that will be share with consumers -> End */

  return (
    <Animated.View style={[animationStyles]} onLayout={handleContainerLayout}>
      <View {...panResponder.panHandlers}>
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
