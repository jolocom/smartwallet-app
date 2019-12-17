import React, { useEffect, useState } from 'react'
import { NotificationComponent } from '../components/notifications'
import { Animated, StyleSheet } from 'react-native'
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
  const notificationHeight = notification && !notification.dismiss ? 94 : 136
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

  return (
    <Animated.View
      style={{
        ...styles.wrapper,
        top: animatedValue,
        height: notificationHeight,
      }}
    >
      {notification && (
        <NotificationComponent
          onPressDismiss={() => notification && onDismiss(notification)}
          onPressInteract={() => notification && onInteract(notification)}
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
