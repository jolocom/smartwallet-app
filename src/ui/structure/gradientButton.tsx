import React from 'react'
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { fontMain } from '../../styles/typography'
import { white } from '../../styles/colors'

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 8,
    marginHorizontal: 20,
    maxWidth: '100%',
    height: 56,
  },
  buttonText: {
    fontFamily: fontMain,
    fontSize: 20,
    color: white,
    fontWeight: 'normal',
  },
})

interface Props {
  onPress: () => void
  text: string
  containerStyle?: ViewStyle
}

export const GradientButton = (props: Props) => {
  const { onPress, containerStyle, text } = props
  return (
    <TouchableOpacity
      style={{ ...styles.buttonContainer, ...containerStyle }}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <LinearGradient
        colors={['rgb(145, 25, 66)', 'rgb(210, 45, 105)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{
          borderRadius: 8,
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text style={styles.buttonText}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  )
}
