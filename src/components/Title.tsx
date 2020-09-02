import React from 'react'
import { TextStyle, Animated, StyleSheet, Platform, Text } from 'react-native'
import { Colors } from '~/utils/colors'
import BP from '~/utils/breakpoints'
import { Fonts } from '~/utils/fonts'

type Style = {
  fontSize: number
  lineHeight: number
  letterSpacing: number
  color: Colors
}

const combineFontStyle = (
  fontSize: number,
  lineHeight: number,
  letterSpacing: number,
  color: Colors,
): Style => ({
  fontSize,
  lineHeight,
  letterSpacing,
  color,
})

const sizes = ['big', 'middle', 'mini', 'tiniest'] as const
type TitleSizes = typeof sizes[number]

const TITLE_SETS: Record<TitleSizes, Style> = {
  big: {
    ...combineFontStyle(
      BP({ xsmall: 26, small: 30, medium: 34, large: 34 }),
      BP({ xsmall: 32, small: 36, medium: 40, large: 40 }),
      0,
      Colors.white90,
    ),
  },
  middle: {
    ...combineFontStyle(
      BP({ xsmall: 24, small: 28, medium: 28, large: 28 }),
      BP({ xsmall: 28, small: 32, medium: 32, large: 32 }),
      0,
      Colors.white90,
    ),
  },
  mini: {
    ...combineFontStyle(
      BP({ xsmall: 14, small: 18, medium: 18, large: 18 }),
      BP({ xsmall: 20, small: 24, medium: 24, large: 24 }),
      0,
      Colors.white90,
    ),
  },
  tiniest: {
    ...combineFontStyle(14, 20, 0, Colors.white70),
  },
}
const SUBTITLE_SETS = {
  big: {
    ...combineFontStyle(
      BP({ xsmall: 18, small: 20, medium: 22, large: 22 }),
      BP({ xsmall: 22, small: 24, medium: 26, large: 26 }),
      BP({ xsmall: 0.12, small: 0.14, medium: 0.15, large: 0.15 }),
      BP({
        xsmall: Colors.white90,
        small: Colors.white90,
        medium: Colors.white80,
        large: Colors.white80,
      }),
    ),
  },
  middle: {
    ...combineFontStyle(
      BP({ xsmall: 16, small: 16, medium: 20, large: 20 }),
      BP({ xsmall: 18, small: 18, medium: 22, large: 22 }),
      BP({ xsmall: 0.11, small: 0.11, medium: 0.14, large: 0.14 }),
      BP({
        xsmall: Colors.white90,
        small: Colors.white90,
        medium: Colors.white70,
        large: Colors.white70,
      }),
    ),
  },
  mini: {
    ...combineFontStyle(
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 14, small: 16, medium: 16, large: 16 }),
      BP({ xsmall: 0, small: 0, medium: 0, large: 0 }),
      Colors.white40,
    ),
  },
  tiniest: {
    ...combineFontStyle(14, 20, 0, Colors.white70),
  },
}

export enum TitleKind {
  title = 'title',
  subtitle = 'subtitle',
}

interface PropsI {
  kind: TitleKind
  size: TitleSizes
  color?: Colors
  customStyles?: TextStyle | Animated.WithAnimatedValue<TextStyle>
  animated?: boolean
}

const Title: React.FC<PropsI> = ({
  children,
  kind,
  size,
  color,
  customStyles,
  animated,
}) => {
  const TextComponent = animated ? Animated.Text : Text
  const fontStylesAllSizes =
    kind === TitleKind.title ? TITLE_SETS : SUBTITLE_SETS
  const fontFamily =
    (kind === TitleKind.title && Fonts.Medium) ||
    (kind === TitleKind.subtitle && Fonts.Regular)
  const sizeStyles = {
    ...fontStylesAllSizes[size],
    fontFamily,
    ...(color && { color }),
  }
  return (
    <TextComponent style={[styles.title, customStyles, sizeStyles]}>
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

export default Title
