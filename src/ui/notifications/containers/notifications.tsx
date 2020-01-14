import React, { useEffect, useState } from 'react'
import { NotificationComponent } from '../components/notifications'
import {
  Animated,
  LayoutChangeEvent,
  PanResponderGestureState,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { connect } from 'react-redux'
import { Notification } from '../../../lib/notifications'
import { ThunkDispatch } from '../../../store'
import { invokeDismiss, invokeInteract } from '../../../actions/notifications'
import GestureRecognizer from 'react-native-swipe-gestures'
import { RootState } from '../../../reducers'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 10,
    width: '100%',
  },
})

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {}

export const NotificationContainer = (props: Props) => {
  const { activeNotification, onDismiss, onInteract } = props

  const [buttonWidth, setButtonWidth] = useState(0)
  const [notification, setNotification] = useState<Notification>()
  const [notificationDimensions, setNotificationDimensions] = useState({
    width: 300,
    height: 100,
  })
  const [animatedValue] = useState<Animated.Value>(
    new Animated.Value(-notificationDimensions.height),
  )
  const isSticky = notification && !notification.dismiss

  useEffect(() => {
    if (!notification && activeNotification) {
      setNotification(activeNotification)
      showNotification().start()
    } else if (notification && !activeNotification) {
      hideNotification().start(() => {
        setNotification(undefined)
      })
    } else if (
      activeNotification &&
      notification &&
      activeNotification.id !== notification.id
    ) {
      //check this
      hideNotification().start(() => {
        setNotification(activeNotification)

        /** NOTE @mnzaki
         * this should be triggered from the (!notif && active) case
         * normally if the active notification is nulled first, but
         * it is not because of animation flicker. If this causes issues
         * later, add an animation queue and only trigger new ones after
         * previous ones are over in general and not for this specific case
         */
        showNotification().start()
      })
    }
  }, [activeNotification, notification])

  const showNotification = () => {
    StatusBar.setBarStyle('light-content')
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    })
  }

  const hideNotification = () => {
    StatusBar.setBarStyle('default')
    return Animated.timing(animatedValue, {
      toValue: -notificationDimensions.height,
      duration: 300,
      useNativeDriver: true,
    })
  }

  const onLayout = (e: LayoutChangeEvent) => {
    const { height, width } = e.nativeEvent.layout
    setNotificationDimensions({ width, height })
  }

  const onButtonLayout = (e: LayoutChangeEvent) => {
    const { width } = e.nativeEvent.layout
    setButtonWidth(width)
  }

  const onSwipe = (gestureName: string, state: PanResponderGestureState) => {
    const isSwipeUp = state.dy < 0 && Math.abs(state.dx) < 110
    // NOTE: disables swiping on the side of the interaction button.
    const buttonMargin = notificationDimensions.width - buttonWidth
    const isButtonAreaSwipe =
      notification && notification.interact && buttonMargin < state.x0
    const shouldSwipe = isSwipeUp && !isSticky && !isButtonAreaSwipe

    if (notification && shouldSwipe) {
      onDismiss(notification)
    }
  }

  return notification ? (
    <Animated.View
      onLayout={onLayout}
      style={{
        ...styles.wrapper,
        transform: [{ translateY: animatedValue }],
      }}
    >
      <GestureRecognizer onSwipe={onSwipe}>
        <NotificationComponent
          onPressDismiss={() => onDismiss(notification)}
          onPressInteract={() => onInteract(notification)}
          onButtonLayout={onButtonLayout}
          notification={notification}
          isSticky={isSticky}
        />
      </GestureRecognizer>
    </Animated.View>
  ) : null
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onDismiss: (notification: Notification) =>
    dispatch(invokeDismiss(notification)),
  onInteract: (notification: Notification) =>
    dispatch(invokeInteract(notification)),
})

const mapStateToProps = (state: RootState) => ({
  activeNotification: state.notifications.active,
})

export const Notifications = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationContainer)
