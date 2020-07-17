import React from 'react'
import { Text, StyleSheet, TextStyle, Animated, Platform } from 'react-native'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum ParagraphSizes {
  large = 'large',
  medium = 'medium',
  small = 'small',
  micro = 'micro',
}

interface PropsI {
  size?: ParagraphSizes
  color?: Colors
  customStyles?: TextStyle | Animated.WithAnimatedValue<TextStyle>
  animated?: boolean
}

const Paragraph: React.FC<PropsI> = ({
  children,
  color = Colors.white,
  size = ParagraphSizes.small,
  customStyles = {},
  animated = false,
}) => {
  const TextComponent = animated ? Animated.Text : Text
  return (
    <TextComponent
      testID="paragraph"
      style={[styles.paragraph, styles[size], { color }, customStyles]}
    >
      {children}
    </TextComponent>
  )
}

type Style = {
  fontSize: number
  lineHeight: number
  letterSpacing: number
}

const getStyle = (
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
): Style => ({
  fontSize,
  lineHeight,
  letterSpacing,
})

const styles = StyleSheet.create({
  paragraph: {
    fontFamily: Fonts.Regular,
    textAlign: 'center',
    paddingTop: Platform.select({
      ios: 5,
      android: 0,
    }),
  },
  micro: {
    ...getStyle(16, 22, 0),
  },
  small: {
    ...getStyle(20, 22, 0.14),
  },
  medium: {
    ...getStyle(22, 26, 0.15),
  },
  large: {
    ...getStyle(28, 32, 0),
  },
})

export default Paragraph
