import React from 'react'
import { RootState } from '../../reducers'
import { connect } from 'react-redux'
import { Text, View } from 'react-native'
import {
  Notification,
  NotificationSeverity,
} from '../../reducers/notifications'
import { ThunkDispatch } from '../../store'
import { AnyAction } from 'redux'

interface WithNotificationsProps
  extends ReturnType<typeof mapStateToProps>,
    ReturnType<typeof mapDispatchToProps> {}

interface NotificationConsumer {
  notification: Notification
  onClose: (notification: Notification) => AnyAction
  onConfirm: (notification: Notification) => AnyAction
}

export const NotificationContainer: React.FC<NotificationConsumer> = ({
  notification,
  onClose,
  onConfirm,
}: NotificationConsumer) => {
  setTimeout(() => {
    onClose(notification)
  }, notification.autoDismissMs)
  return (
    <View onTouchEnd={() => onConfirm(notification)}>
      <Text> {JSON.stringify(notification)}</Text>
    </View>
  )
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
  dispatchHandler,
  ...rest
}: WithNotificationsProps & P) => {
  const notification = notifications[0]
  return (
    <View
      style={{
        height: '100%',
        width: '100%',
      }}
    >
      {notification && (
        <NotificationContainer
          notification={notification}
          onClose={dispatchHandler(notification.onClose)}
          onConfirm={dispatchHandler(notification.onConfirm)}
        />
      )}
      <WrappedComponent {...(rest as P)} />
    </View>
  )
}
// Only highest severity notifications are rendered here
const mapStateToProps = (state: RootState) => ({
  notifications: state.notifications.filter(
    ({ severity }) => severity === NotificationSeverity.high,
  ),
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  dispatchHandler: (handler: (notification: Notification) => AnyAction) => (
    notification: Notification,
  ) => dispatch(handler(notification)),
})

export const withNotificationSupport = <T extends object>(
  toWrap: React.ComponentType<T>,
) =>
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(WithNotificationSupport(toWrap))
