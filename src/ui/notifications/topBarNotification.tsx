import React from 'react'
import { NotificationConsumer } from './types'
import { Text, View } from 'react-native'

/**
 * Reference implementation of a {@link NotificationConsumer} component.
 * Will render the notification bar and fire the appropriate handlers upon user interaction.
 * @note if the notification is dismissible, a call to handleDismiss will be scheduled on mount (delayed by the notification's autoDismissMs)
 * @param notification - The notification to be rendered
 * @param handleConfirm - A function to call if the user confirms (simply dispatch(notification.handleConfirm(notification)))
 * @param handleDismiss - A function simillar to handleConfirm, to be triggered if the user dismisses the notification,
 * or after the delay specified in notification.autoDismissMs
 * @constructor
 */

export const TopBarNotification: React.FC<NotificationConsumer> = ({
  notification,
  handleConfirm,
  handleDismiss,
}: NotificationConsumer) => {
  if (notification.dismissible) {
    setTimeout(() => {
      handleDismiss(notification)
    }, notification.autoDismissMs || 3000)
  }
  return (
    <View onTouchEnd={() => handleConfirm(notification)}>
      <Text> {JSON.stringify(notification)}</Text>
    </View>
  )
}
