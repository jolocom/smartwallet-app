import React from 'react'
import {
  TextStyle,
  Animated,
  StyleSheet,
  Platform,
  Text,
  TextProps,
} from 'react-native'
import { Colors } from '~/utils/colors'
import {
  titleFontStyles,
  subtitleFontStyles,
  JoloTextSizes,
  Fonts,
} from '~/utils/fonts'

export enum JoloTextKind {
  title = 'title',
  subtitle = 'subtitle',
}

export enum JoloTextWeight {
  medium = 'medium',
  regular = 'regular',
}

export interface IJoloTextProps extends TextProps {
  kind?: JoloTextKind
  size?: JoloTextSizes
  weight?: JoloTextWeight
  color?: Colors
  customStyles?: TextStyle | Animated.WithAnimatedValue<TextStyle>
  animated?: boolean
  testID?: string
}

const JoloText: React.FC<IJoloTextProps> = (props) => {
  const {
    children,
    kind = JoloTextKind.subtitle,
    size = JoloTextSizes.middle,
    weight,
    color,
    customStyles,
    animated,
    testID,
    ...rest
  } = props

  const TextComponent = animated ? Animated.Text : Text
  const fontStylesAllSizes =
    kind === JoloTextKind.title ? titleFontStyles : subtitleFontStyles
  const sizeStyles = {
    ...fontStylesAllSizes[size],
    ...(color && { color }),
    ...(weight && {
      fontFamily:
        weight === JoloTextWeight.medium ? Fonts.Medium : Fonts.Regular,
    }),
  }

  return (
    <TextComponent
      {...(rest as typeof Text)}
      testID={testID}
      style={[styles.title, sizeStyles, customStyles]}
    >
      {children}
    </TextComponent>
  )
}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    paddingTop: Platform.select({
      ios: 5,
      android: 0,
    }),
  },
})

export default JoloText
