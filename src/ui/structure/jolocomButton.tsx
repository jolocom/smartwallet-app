import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Buttons } from 'src/styles'
import LinearGradient from 'react-native-linear-gradient'
import { fontMain } from '../../styles/typography'

const styles = StyleSheet.create({
  container: {
    ...Buttons.buttonStandardContainer,
  },
  text: {
    ...Buttons.buttonStandardText,
    fontFamily: fontMain,
  },
  disabledText: {
    opacity: 0.25,
  },
  gradientWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 26,
  },
})

interface Props {
  onPress: () => void
  text: string
  disabled?: boolean
  containerStyle?: ViewStyle
  textStyle?: TextStyle
  testID?: string
  transparent?: boolean
}

export const JolocomButton: React.FC<Props> = props => {
  const {
    onPress,
    containerStyle,
    textStyle,
    text,
    disabled,
    transparent,
    testID,
  } = props
  const onButtonPress = () => (disabled ? null : onPress())
  const gradientColors = ['rgb(145, 25, 66)', 'rgb(210, 45, 105)']
  const gradient = transparent ? ['transparent', 'transparent'] : gradientColors

  return (
    <LinearGradient
      colors={gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        ...styles.container,
        ...containerStyle,
      }}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onButtonPress}
        testID={testID}
        style={styles.gradientWrapper}
      >
        <Text style={[styles.text, textStyle, disabled && styles.disabledText]}>
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
