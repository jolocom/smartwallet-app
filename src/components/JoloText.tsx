import React, { useState } from 'react'
import {
  TextStyle,
  Animated,
  StyleSheet,
  Platform,
  Text,
  TextProps,
  StyleProp,
} from 'react-native'

import { TextLayoutEvent } from '~/types/props'
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

type ellipseSuffix = {
  numOfLines: number
  suffix?: string
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
  ellipseSuffix?: ellipseSuffix
}

const JoloText: React.FC<IJoloTextProps> = ({
  kind = JoloTextKind.subtitle,
  size = JoloTextSizes.middle,
  weight,
  color,
  customStyles,
  animated,
  testID,
  ellipseSuffix,
  ignoreScaling = false,
  children,
  ...rest
}) => {
  const [truncatedText, setTruncatedText] = useState('')

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

  const truncateTextByNumOfLines = (e: TextLayoutEvent) => {
    const { lines } = e.nativeEvent

    if (lines.length > ellipseSuffix!.numOfLines) {
      const output = lines
        .splice(0, ellipseSuffix!.numOfLines)
        .map((line) => line.text)
        .join('')

      ellipseSuffix!.suffix
        ? setTruncatedText(output.slice(0, -4) + '...' + ellipseSuffix!.suffix)
        : setTruncatedText(output.slice(0, -3) + '...')
    }
  }

  return (
    <TextComponent
      {...(rest as typeof Text)}
      testID={testID}
      style={[styles.title, propStyles, customStyles]}
      // @ts-expect-error
      onTextLayout={ellipseSuffix && truncateTextByNumOfLines}
    >
      {truncatedText || children}
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
