import React from 'react'
import { NotificationType } from '../../../lib/notifications'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { black, white } from '../../../styles/colors'
import { fontMain } from '../../../styles/typography'

const styles = StyleSheet.create({
  wrapper: {
    //minWidth: 67,
    height: 27,
    borderRadius: 6.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
    zIndex: 11,
  },
  buttonText: {
    // TODO change to TTCommons-Bold
    fontFamily: fontMain,
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningWrapper: {
    backgroundColor: '#f3c61c',
  },
  infoWrapper: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: white,
  },
})

interface Props {
  notificationType: NotificationType
  onPress: () => void
  label: string
}

export const InteractButton = (props: Props) => {
  const { onPress, label, notificationType } = props
  const isWarning = notificationType === NotificationType.warning

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...styles.wrapper,
        ...(isWarning ? styles.warningWrapper : styles.infoWrapper),
      }}
    >
      <Text style={{ ...styles.buttonText, color: isWarning ? black : white }}>
        {label}
      </Text>
    </TouchableOpacity>
  )
}
