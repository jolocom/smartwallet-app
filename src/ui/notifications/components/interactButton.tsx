import React from 'react'
import { NotificationType } from '../../../lib/notifications'
import {
  LayoutChangeEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { black, white } from '../../../styles/colors'
import { fontMain } from '../../../styles/typography'
import { BP } from '../../../styles/breakpoints'

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingVertical: BP({
      large: 15,
      medium: 12,
      small: 12,
    }),
    minWidth: 100,
  },
  button: {
    height: 27,
    borderRadius: 6.4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 17,
  },
  buttonText: {
    // TODO change to TTCommons-Bold
    fontFamily: fontMain,
    fontSize: 12,
    fontWeight: 'bold',
  },
  warningButton: {
    backgroundColor: '#f3c61c',
  },
  infoButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: white,
  },
})

interface Props {
  notificationType: NotificationType
  onPress: () => void
  label: string
  onLayout?: (event: LayoutChangeEvent) => void
}

export const InteractButton = (props: Props) => {
  const { onPress, label, notificationType, onLayout } = props
  const isWarning = notificationType === NotificationType.warning

  return (
    <TouchableOpacity
      onLayout={onLayout}
      style={styles.wrapper}
      onPress={onPress}
    >
      <View
        style={{
          ...styles.button,
          ...(isWarning ? styles.warningButton : styles.infoButton),
        }}
      >
        <Text
          style={{ ...styles.buttonText, color: isWarning ? black : white }}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  )
}
