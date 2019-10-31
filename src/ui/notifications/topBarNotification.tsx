import React from 'react'
import { NotificationConsumer } from './types'
import { Text, View } from 'react-native'

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
