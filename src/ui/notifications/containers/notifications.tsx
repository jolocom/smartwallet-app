import React, { useEffect, useLayoutEffect, useState } from 'react'
import { NotificationComponent } from '../components/notifications'
import { Animated, SafeAreaView, StyleSheet } from 'react-native'
import { connect } from 'react-redux'
import { INotification } from '../../../lib/notifications'
import { ThunkDispatch } from '../../../store'
import { invokeDismiss, invokeInteract } from '../../../actions/notifications'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
})

interface Props extends ReturnType<typeof mapDispatchToProps> {
  activeNotification: INotification | null
}

export const NotificationContainer = (props: Props) => {
  const { activeNotification, onDismiss, onInteract } = props

  const [notification, setNotification] = useState<INotification>()
  const [notificationHeight, setNotificationHeight] = useState(100)
  const [animatedValue] = useState<Animated.Value>(
    new Animated.Value(-notificationHeight),
  )

  useEffect(() => {
    if (!notification && activeNotification) {
      setNotification(activeNotification)
      showNotification().start()
    } else if (!activeNotification) {
      hideNotification().start()
    } else if (notification && activeNotification.id !== notification.id) {
      //check this
      hideNotification().start(() => {
        setNotification(activeNotification)
        showNotification().start()
      })
    }
  }, [activeNotification])

  const showNotification = () =>
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
    })

  const hideNotification = () =>
    Animated.timing(animatedValue, {
      toValue: -notificationHeight,
      duration: 300,
    })

  const onLayout = (e: any) => {
    const { height } = e.nativeEvent.layout
    setNotificationHeight(height)
  }

  return (
    <Animated.View
      onTouchEnd={() => notification && onInteract(notification)}
      onLayout={onLayout}
      style={{
        ...styles.wrapper,
        transform: [{ translateY: animatedValue }],
      }}
    >
      {notification && (
        <NotificationComponent
          onPressDismiss={() => onDismiss(notification)}
          onPressInteract={() => onInteract(notification)}
          notification={notification}
        />
      )}
    </Animated.View>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onDismiss: (notification: INotification) =>
    dispatch(invokeDismiss(notification)),
  onInteract: (notification: INotification) =>
    dispatch(invokeInteract(notification)),
})

export const Notification = connect(
  null,
  mapDispatchToProps,
)(NotificationContainer)
