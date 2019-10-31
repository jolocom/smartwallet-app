import React from 'react'
import { RootState } from '../../reducers'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import { Notification } from '../../reducers/notifications'
import { ThunkDispatch } from '../../store'
import { AnyAction } from 'redux'

interface WithNotificationsProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

interface NotificationProps {
  notification: Notification
  removeFromQueue: (toRemove: Notification) => AnyAction
}

export const NotificationContainer: React.FC<NotificationProps> = ({
  notification,
  removeFromQueue,
}: NotificationProps) => {
  console.log('NOTIFICATION =', notification)
  if (notification) {
    setTimeout(() => {
      removeFromQueue(notification)
    }, 5000)
    return <Text> {JSON.stringify(notification)}</Text>
  }
  return <View />
}

/**
 * @type P - The props of the wrapped component / container
 * @param WrappedComponent
 * @constructor
 */
export const WithNotificationSupport = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
): React.ComponentType<P & WithNotificationsProps> => ({
  notifications,
  scheduleNotificationRemoval,
  ...rest
}: WithNotificationsProps & P) => (
  <View
    style={{
      height: '100%',
      width: '100%',
    }}
  >
    <NotificationContainer
      notification={notifications[0]}
      removeFromQueue={scheduleNotificationRemoval}
    />
    <WrappedComponent {...(rest as P)} />
  </View>
)

const mapStateToProps = (state: RootState) => ({
  notifications: state.notifications,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  scheduleNotificationRemoval: (notification: Notification) =>
    dispatch(notification.onClose(notification)),
})

export const withNotificationSupport = <T extends object>(
  toWrap: React.ComponentType<T>,
) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(WithNotificationSupport(toWrap))
