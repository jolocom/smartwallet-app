import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum BtnTypes {
  primary,
  secondary,
  tertiary,
}

export enum BtnSize {
  large,
  medium,
}

interface PropsI {
  type?: BtnTypes
  size?: BtnSize
  onPress: () => void
  disabled?: boolean
  customTextStyles?: TextStyle
  customContainerStyles?: ViewStyle
}

const GRADIENT_START = { x: 0, y: 0 }
const GRADIENT_END = { x: 1, y: 0 }

const Button: React.FC<PropsI> = ({
  type = BtnTypes.primary,
  size = BtnSize.large,
  onPress,
  children,
  disabled,
  customTextStyles = {},
  customContainerStyles = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.btn,
        size === BtnSize.large ? styles.largeBtn : styles.mediumBtn,
        customContainerStyles,
      ]}
      disabled={disabled}
    >
      <Text
        style={[
          styles.text,
          type === BtnTypes.primary
            ? styles.textPrimary
            : type === BtnTypes.secondary
            ? styles.textSecondary
            : styles.textTertiary,
          customTextStyles,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  )
}

const Btn: React.FC<PropsI> = (props) => {
  const containerStyles = [styles.container, props.disabled && styles.disabled]

  if (props.type === BtnTypes.primary) {
    return (
      <LinearGradient
        testID="gradient"
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={containerStyles}
        colors={[Colors.disco, Colors.ceriseRed]}
      >
        <Button {...props} />
      </LinearGradient>
    )
  } else if (props.type === BtnTypes.tertiary) {
    return (
      <View
        style={[containerStyles, { backgroundColor: Colors.matterhorn18 }]}
        testID="tertiary-button"
      >
        <Button {...props} />
      </View>
    )
  }
  return (
    <View style={containerStyles} testID="non-gradient">
      <Button {...props} />
    </View>
  )
}

Btn.defaultProps = {
  type: BtnTypes.primary,
  size: BtnSize.large,
  disabled: false,
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    borderRadius: 8,
    marginVertical: 5,
  },
  largeBtn: {
    paddingVertical: 16,
  },
  mediumBtn: {
    paddingVertical: 12,
  },
  btn: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 20,
    color: Colors.white,
    margin: 0,
  },
  textPrimary: {
    fontFamily: Fonts.Medium,
  },
  textSecondary: {
    fontFamily: Fonts.Regular,
    opacity: 0.8,
  },
  textTertiary: {
    fontFamily: Fonts.Medium,
  },
})

export default Btn
