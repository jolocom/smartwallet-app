import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { fontMain } from '../../../styles/typography'
import { black, white } from '../../../styles/colors'
import { INotification, NotificationType } from '../../../lib/notifications'

const styles = StyleSheet.create({
  title: {
    fontFamily: fontMain,
    height: 20,
    fontSize: 20,
    color: white,
    marginLeft: 20,
    marginTop: 44,
  },
  message: {
    fontFamily: fontMain,
    fontSize: 16,
    color: white,
    marginHorizontal: 20,
    marginTop: 12,
  },
  buttonWrapper: {
    height: 30,
    marginTop: 18,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: 90,
    height: 30,
    marginRight: 23,
    backgroundColor: '#f3c61c',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: black,
    // TODO change to TTCommons-Bold
    fontFamily: fontMain,
    fontSize: 12,
    fontWeight: 'bold',
  },
})

interface Props {
  notification: INotification
  onPressDismiss: () => void
  onPressInteract: () => void
}

export const NotificationComponent: React.FC<Props> = ({
  notification,
  onPressDismiss,
  onPressInteract,
}) => {
  return (
    <React.Fragment>
      <Text style={styles.title}>
        {notification.type !== NotificationType.error && notification.title}
      </Text>
      <Text style={styles.message}>
        {notification.type !== NotificationType.error && notification.message}
      </Text>
      <View style={styles.buttonWrapper}>
        {notification.dismiss ? (
          <TouchableOpacity
            onPress={onPressDismiss}
            style={{
              width: 30,
              height: 30,
              marginLeft: 14,
              backgroundColor: white,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text>x</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        {notification.interact ? (
          <TouchableOpacity
            onPress={onPressInteract}
            style={styles.actionButton}
          >
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </React.Fragment>
  )
}
