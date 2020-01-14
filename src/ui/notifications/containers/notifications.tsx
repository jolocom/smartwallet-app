import React, { useEffect, useState } from 'react'
import { NotificationComponent } from '../components/notifications'
import {
  Animated,
  LayoutChangeEvent,
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

  const [notification, setNotification] = useState<Notification>()
  const [notificationHeight, setNotificationHeight] = useState(100)
  const [animatedValue] = useState<Animated.Value>(
    new Animated.Value(-notificationHeight),
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
      toValue: -notificationHeight,
      duration: 300,
      useNativeDriver: true,
    })
  }

  const onLayout = (e: LayoutChangeEvent) => {
    const { height } = e.nativeEvent.layout
    setNotificationHeight(height)
  }

  const onSwipe = (gestureName: string) => {
    if (notification && !isSticky && gestureName !== 'SWIPE_DOWN') {
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
      <GestureRecognizer
        config={{
          velocityThreshold: 0.3,
          directionalOffsetThreshold: 80,
          // @ts-ignore
          // NOTE: when the this commit will be in the next release, the ts-ignore can be removed
          // https://github.com/glepur/react-native-swipe-gestures/commit/c864dafcba347b90b6fd4971daa37fb84f6f042a#diff-b52768974e6bc0faccb7d4b75b162c99
          gestureIsClickThreshold: 40,
        }}
        onSwipe={onSwipe}
      >
        <NotificationComponent
          onPressDismiss={() => onDismiss(notification)}
          onPressInteract={() => onInteract(notification)}
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
