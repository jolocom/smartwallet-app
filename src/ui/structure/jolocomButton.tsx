import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { Buttons, Colors } from 'src/styles'
import LinearGradient from 'react-native-linear-gradient'

const styles = StyleSheet.create({
  container: {
    ...Buttons.buttonStandardContainer,
  },
  text: {
    ...Buttons.buttonStandardText,
  },
  disabledText: {
    ...Buttons.buttonDisabledStandardText,
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
  const gradientColors = disabled
    ? [Colors.disabledButtonBackground, Colors.disabledButtonBackground]
    : ['rgb(145, 25, 66)', 'rgb(210, 45, 105)']
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
        <Text style={[disabled ? styles.disabledText : styles.text, textStyle]}>
          {text}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  )
}
