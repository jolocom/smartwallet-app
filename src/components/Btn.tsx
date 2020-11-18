import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  Platform,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum BtnTypes {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  quaternary = 'quaternary',
  quinary = 'quinary',
}

export enum BtnSize {
  large,
  medium,
}

interface BtnPropsI {
  type?: BtnTypes
  customTextStyles?: TextStyle
  size?: BtnSize
}

interface PropsI extends BtnPropsI {
  size?: BtnSize
  onPress: () => void
  disabled?: boolean
  withoutMargins?: boolean
  customContainerStyles?: ViewStyle
}

const GRADIENT_START = { x: 0, y: 0 }
const GRADIENT_END = { x: 1, y: 0 }

const ButtonText: React.FC<BtnPropsI> = ({
  type = BtnTypes.primary,
  size = BtnSize.medium,
  children,
  customTextStyles = {},
}) => {
  const getTextStyle = () => {
    switch (type) {
      case BtnTypes.primary:
        return styles.textPrimary
      case BtnTypes.secondary:
        return styles.textSecondary
      case BtnTypes.tertiary:
        return styles.textTertiary
      case BtnTypes.quaternary:
        return styles.textQuaternary
      case BtnTypes.quinary:
        return styles.textQuinary
      default:
        return styles.textPrimary
    }
  }
  return (
    <Text
      style={[
        styles.text,
        getTextStyle(),
        { fontSize: size === BtnSize.medium ? 18 : 20 },
        customTextStyles,
      ]}
    >
      {children}
    </Text>
  )
}

const Btn: React.FC<PropsI> = (props) => {
  const containerStyles = [
    styles.container,
    props.disabled && styles.disabled,
    { marginVertical: props.withoutMargins ? 0 : 5 },
  ]
  const btnStyle =
    props.size === BtnSize.large ? styles.largeBtn : styles.mediumBtn

  const renderButton = () => {
    switch (props.type) {
      case BtnTypes.primary:
        return (
          <LinearGradient
            testID="gradient"
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={[styles.container, btnStyle]}
            colors={[Colors.disco, Colors.ceriseRed]}
          >
            <ButtonText {...props} />
          </LinearGradient>
        )
      case BtnTypes.secondary:
      case BtnTypes.tertiary:
        return (
          <View
            style={[containerStyles, props.customContainerStyles, btnStyle]}
            testID="non-gradient"
          >
            <ButtonText {...props} />
          </View>
        )
      case BtnTypes.quaternary:
      case BtnTypes.quinary:
        return (
          <View
            style={[
              containerStyles,
              { backgroundColor: Colors.matterhorn18 },
              props.customContainerStyles,
              btnStyle,
            ]}
          >
            <ButtonText {...props} />
          </View>
        )
    }
  }

  return (
    <TouchableOpacity
      style={containerStyles}
      onPress={props.onPress}
      disabled={props.disabled}
      testID="button"
    >
      {renderButton()}
    </TouchableOpacity>
  )
}

Btn.defaultProps = {
  type: BtnTypes.primary,
  size: BtnSize.medium,
  disabled: false,
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  largeBtn: {
    height: 56,
  },
  mediumBtn: {
    height: 45,
  },
  btn: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: Colors.white,
    textAlignVertical: 'center',
    paddingTop: Platform.select({
      ios: 5,
      android: 0,
    }),
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
  textQuaternary: {
    fontFamily: Fonts.Regular,
    opacity: 0.8,
    color: Colors.activity,
  },
  textQuinary: {
    fontFamily: Fonts.Regular,
    opacity: 0.8,
    color: Colors.success,
  },
})

export default Btn
