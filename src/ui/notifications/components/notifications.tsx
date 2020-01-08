import React from 'react'
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { fontMain } from '../../../styles/typography'
import { white, yellowError } from '../../../styles/colors'
import { INotification } from '../../../lib/notifications'
import { InteractButton } from './interactButton'
import { CrossNotificationIcon } from '../../../resources'
import { AnyAction } from 'redux'
import { BP } from '../../../styles/breakpoints'

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'rgba(0,0,0,0.9)',
    paddingBottom: BP({
      small: 11,
      medium: 11,
      large: 15,
    }),
  },
  title: {
    // TODO: replace with TTCommons Medium
    fontFamily: fontMain,
    fontSize: BP({
      small: 16,
      medium: 16,
      large: 18,
    }),
    marginTop: BP({
      small: 12,
      medium: 16,
      large: 20,
    }),
    marginHorizontal: 20,
  },
  message: {
    fontFamily: fontMain,
    fontSize: BP({
      small: 12,
      medium: 12,
      large: 14,
    }),
    color: white,
    marginHorizontal: 20,
    marginTop: 8,
  },
  buttonWrapper: {
    marginHorizontal: 20,
    marginTop: BP({
      large: 15,
      medium: 12,
      small: 12,
    }),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dismissButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
})

interface Props {
  notification: INotification
  onPressDismiss: () => void | boolean | AnyAction | Promise<void | AnyAction>
  onPressInteract: () => void | boolean | AnyAction | Promise<void | AnyAction>
}

export const NotificationComponent: React.FC<Props> = ({
  notification,
  onPressDismiss,
  onPressInteract,
}) => {
  const isSticky = notification.dismiss && !notification.dismiss.timeout
  const isButtonSection = notification.dismiss || notification.interact

  return (
    <SafeAreaView style={styles.wrapper}>
      <Text
        style={{
          ...styles.title,
          ...(isSticky && styles.centeredText),
          color: isSticky ? yellowError : white,
        }}
      >
        {notification.title}
      </Text>
      <Text style={{ ...styles.message, ...(isSticky && styles.centeredText) }}>
        {notification.message}
      </Text>
      {!isSticky && isButtonSection && (
        <View style={styles.buttonWrapper}>
          {notification.dismiss ? (
            <TouchableOpacity
              onPress={onPressDismiss}
              style={styles.dismissButton}
            >
              <CrossNotificationIcon />
            </TouchableOpacity>
          ) : (
            <View />
          )}
          {notification.interact ? (
            <InteractButton
              onPress={onPressInteract}
              label={notification.interact.label}
              notificationType={notification.type}
            />
          ) : (
            <View />
          )}
        </View>
      )}
    </SafeAreaView>
  )
}
