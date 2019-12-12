import React from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { fontMain } from '../../styles/typography'
import { white } from '../../styles/colors'

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    maxWidth: '100%',
    height: 56,
  },
  buttonText: {
    fontFamily: fontMain,
    fontSize: 20,
    color: white,
    fontWeight: 'normal',
    paddingTop: Platform.select({
      ios: 5,
      android: 0,
    }),
  },
})

interface Props {
  onPress: () => void
  text: string
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  disabled?: boolean
}

export const GradientButton = (props: Props) => {
  const { onPress, containerStyle, text, textStyle, disabled } = props
  return (
    <TouchableOpacity
      style={{ ...styles.buttonContainer, ...containerStyle }}
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        colors={
          !disabled
            ? ['rgb(145, 25, 66)', 'rgb(210, 45, 105)']
            : ['rgb(73, 9, 35)', 'rgb(123, 18, 53)', 'rgb(123, 18, 53)']
        }
        start={!disabled ? { x: 0, y: 0 } : { x: 0, y: 0 }}
        end={!disabled ? { x: 1, y: 0 } : { x: 0, y: 0.3 }}
        style={{
          borderRadius: 8,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={{ ...styles.buttonText, ...textStyle }}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}
