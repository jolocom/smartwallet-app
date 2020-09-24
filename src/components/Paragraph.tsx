import React from 'react'
import { Text, StyleSheet, TextStyle, Animated, Platform } from 'react-native'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import BP from '~/utils/breakpoints'

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

// TODO: should be removed and its instaces changed to JoloText
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
    ...getStyle(14, 14, 0),
  },
  small: {
    ...getStyle(
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 0, small: 0, medium: 0, large: 0 }),
    ),
  },
  medium: {
    ...getStyle(
      BP({ xsmall: 16, small: 16, medium: 20, large: 20 }),
      BP({ xsmall: 18, small: 18, medium: 22, large: 22 }),
      BP({ xsmall: 0.11, small: 0.11, medium: 0.14, large: 0.14 }),
    ),
  },
  large: {
    ...getStyle(
      BP({ xsmall: 18, small: 20, medium: 22, large: 22 }),
      BP({ xsmall: 22, small: 24, medium: 26, large: 26 }),
      BP({ xsmall: 0.12, small: 0.14, medium: 0.15, large: 0.15 }),
    ),
  },
})

export default Paragraph
