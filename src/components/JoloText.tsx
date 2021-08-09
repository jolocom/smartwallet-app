import React from 'react'
import {
  TextStyle,
  Animated,
  StyleSheet,
  Platform,
  Text,
  TextProps,
  StyleProp,
} from 'react-native'
import { Colors } from '~/utils/colors'
import { JoloTextSizes, Fonts, fonts, scaleFont } from '~/utils/fonts'

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
  customStyles?: StyleProp<TextStyle> | Animated.WithAnimatedValue<TextStyle>
  animated?: boolean
  testID?: string
  ignoreScaling?: boolean
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
    ignoreScaling = false,
    ...rest
  } = props

  const TextComponent = animated ? Animated.Text : Text

  const fontSets = fonts[kind][size]
  const targetFontStyle = scaleFont(fontSets)

  const finalFontStyle = ignoreScaling ? fontSets.large : targetFontStyle

  const propStyles = {
    ...finalFontStyle,
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
      style={[styles.title, propStyles, customStyles]}
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
