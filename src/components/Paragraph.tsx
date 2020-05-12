import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'

import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum ParagraphSizes {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

interface PropsI {
  size?: ParagraphSizes
  color?: Colors
  customStyles?: TextStyle
}

const Paragraph: React.FC<PropsI> = ({
  children,
  color = Colors.white,
  size = ParagraphSizes.small,
  customStyles = {},
}) => {
  return (
    <Text
      testID="paragraph"
      style={[styles.paragraph, styles[size], { color }, customStyles]}
    >
      {children}
    </Text>
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
