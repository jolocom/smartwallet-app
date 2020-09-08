import React from 'react'
import { TextStyle, Animated, StyleSheet, Platform, Text } from 'react-native'
import { Colors } from '~/utils/colors'
import { titleFontStyles, subtitleFontStyles, TitleSizes } from '~/utils/fonts'

export enum JoloTextKind {
  title = 'title',
  subtitle = 'subtitle',
}

interface PropsI {
  kind: JoloTextKind
  size: TitleSizes
  color?: Colors
  customStyles?: TextStyle | Animated.WithAnimatedValue<TextStyle>
  animated?: boolean
}

const JoloText: React.FC<PropsI> = ({
  children,
  kind,
  size,
  color,
  customStyles,
  animated,
}) => {
  const TextComponent = animated ? Animated.Text : Text
  const fontStylesAllSizes =
    kind === JoloTextKind.title ? titleFontStyles : subtitleFontStyles
  const sizeStyles = {
    ...fontStylesAllSizes[size],
    ...(color && { color }),
  }
  return (
    <TextComponent style={[styles.title, sizeStyles, customStyles]}>
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
