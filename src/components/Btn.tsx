import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  TextStyle,
  ViewStyle,
  Platform,
  TouchableOpacityProps,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import useConnection from '~/hooks/connection'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum BtnTypes {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  quaternary = 'quaternary',
  quinary = 'quinary',
  senary = 'senary',
  septenary = 'septenary',
}

export enum BtnSize {
  large,
  medium,
  small,
}

interface BtnPropsI extends TouchableOpacityProps {
  type?: BtnTypes
  customTextStyles?: TextStyle
  size?: BtnSize | number
}

interface PropsI extends BtnPropsI {
  size?: BtnSize
  disabled?: boolean
  withoutMargins?: boolean
  customContainerStyles?: ViewStyle
  testID?: string
}

interface BtnComposition {
  Online: React.FC<PropsI>
}

const GRADIENT_START = { x: 0, y: 0 }
const GRADIENT_END = { x: 1, y: 0 }

const ButtonText: React.FC<BtnPropsI> = ({
  type = BtnTypes.primary,
  size = BtnSize.medium,
  children,
  customTextStyles = {},
}) => {
  const getTextSize = () => {
    if (Object.values(BtnSize).includes(size)) {
      switch (size) {
        case BtnSize.large:
          return 20
        case BtnSize.medium:
          return 18
        case BtnSize.small:
          return 12
        default:
          return 18
      }
    } else {
      return size
    }
  }

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
      case BtnTypes.senary:
        return styles.textSenary
      default:
        return styles.textPrimary
    }
  }
  return (
    <Text
      style={[
        styles.text,
        getTextStyle(),
        { fontSize: getTextSize() },
        customTextStyles,
      ]}
    >
      {children}
    </Text>
  )
}

const Btn: React.FC<PropsI> & BtnComposition = ({
  disabled,
  withoutMargins,
  size,
  type,
  customTextStyles,
  customContainerStyles,
  testID,
  children,
  ...btnProps
}) => {
  const containerStyles = [
    styles.container,
    disabled && styles.disabled,
    { marginVertical: withoutMargins ? 0 : 5 },
  ]
  const btnStyle =
    size === BtnSize.large
      ? styles.largeBtn
      : size === BtnSize.small
      ? styles.smallBtn
      : styles.mediumBtn

  const renderButton = () => {
    const btnTextProps = { size, type, customTextStyles, children }
    switch (type) {
      case BtnTypes.primary:
        return (
          <LinearGradient
            testID="gradient"
            start={GRADIENT_START}
            end={GRADIENT_END}
            style={[styles.container, btnStyle]}
            colors={[Colors.disco, Colors.ceriseRed]}
          >
            <ButtonText {...btnTextProps} />
          </LinearGradient>
        )
      case BtnTypes.secondary:
      case BtnTypes.tertiary:
        return (
          <View
            style={[containerStyles, btnStyle, customContainerStyles]}
            testID="non-gradient"
          >
            <ButtonText {...btnTextProps} />
          </View>
        )
      case BtnTypes.quaternary:
      case BtnTypes.quinary:
      case BtnTypes.senary:
        return (
          <View
            style={[
              containerStyles,
              {
                backgroundColor: Colors.matterhorn18,
              },
              customContainerStyles,
              btnStyle,
            ]}
          >
            <ButtonText {...btnTextProps} />
          </View>
        )
      case BtnTypes.septenary:
        return (
          <View
            style={[
              containerStyles,
              {
                backgroundColor: Colors.white06,
                borderStyle: 'solid',
                borderWidth: 0.8,
                borderColor: Colors.silverChalice,
              },
              customContainerStyles,
              btnStyle,
            ]}
          >
            <ButtonText {...btnTextProps} />
          </View>
        )
      default:
        return null
    }
  }

  return (
    <TouchableOpacity
      style={containerStyles}
      disabled={disabled}
      testID={testID || 'button'}
      {...btnProps}
    >
      {renderButton()}
    </TouchableOpacity>
  )
}

const OnlineBtn: React.FC<PropsI> = ({ children, ...props }) => {
  const { connected } = useConnection()

  return (
    <Btn {...props} disabled={!connected || props.disabled}>
      {children}
    </Btn>
  )
}

Btn.Online = OnlineBtn

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
  smallBtn: {
    height: 26,
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
  textSenary: {
    fontFamily: Fonts.Medium,
    opacity: 0.8,
    color: Colors.white,
  },
  textSeptenary: {
    fontFamily: Fonts.Regular,
    color: Colors.white,
  },
})

export default Btn
