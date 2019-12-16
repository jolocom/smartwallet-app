import React, { useEffect, useState } from 'react'
import { NotificationComponent } from '../components/notifications'
import { Animated, StyleSheet } from 'react-native'
import { RootState } from '../../../reducers'
import { connect } from 'react-redux'
import { INotification, NotificationType } from '../../../lib/notifications'
import { ThunkDispatch } from '../../../store'
import { invokeDismiss, invokeInteract } from '../../../actions/notifications'

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 2,
    width: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
})

interface Props
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

export const NotificationContainer = (props: Props) => {
  const { activeNotification, onDismiss, onInteract } = props

  const [notification, setNotification] = useState<INotification>()
  const notificationHeight =
    notification && notification.type === NotificationType.info ? 150 : 192
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

  const showNotification = () => {
    return Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
    })
  }

  const hideNotification = () => {
    return Animated.timing(animatedValue, {
      toValue: -notificationHeight,
      duration: 300,
    })
  }

  const onPressDismiss = () => {
    hideNotification()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onDismiss(notification!)
  }

  const onPressInteract = () => {
    hideNotification()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    onInteract(notification!)
  }

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
          onPressDismiss={onPressDismiss}
          onPressInteract={onPressInteract}
          notification={notification}
        />
      )}
    </Animated.View>
  )
}

const mapStateToProps = (state: RootState) => ({
  activeNotification: state.notifications.active,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  onDismiss: (notification: INotification) =>
    dispatch(invokeDismiss(notification)),
  onInteract: (notification: INotification) =>
    dispatch(invokeInteract(notification)),
})

export const Notification = connect(
  mapStateToProps,
  mapDispatchToProps,
)(NotificationContainer)
