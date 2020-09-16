import React from 'react'
import { Text, StyleSheet, TextStyle } from 'react-native'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'
import BP from '~/utils/breakpoints'

export enum HeaderSizes {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

export enum HeaderWeight {
  bold = 'bold',
  regular = 'regular',
}

interface PropsI {
  size?: HeaderSizes
  hasShadow?: boolean
  color?: Colors
  customStyles?: TextStyle
  weight?: HeaderWeight
}

// TODO: should be removed and its instaces changed to JoloText
const Header: React.FC<PropsI> = ({
  size = HeaderSizes.medium,
  weight = HeaderWeight.bold,
  hasShadow = false,
  color = Colors.white,
  customStyles = {},
  children,
}) => {
  return (
    <Text
      testID="header"
      style={[
        styles.text,
        styles[size],
        { color },
        {
          fontFamily:
            weight === HeaderWeight.bold ? Fonts.Medium : Fonts.Regular,
        },
        customStyles,
        hasShadow && styles.shadow,
      ]}
    >
      {children}
    </Text>
  )
}

type Style = {
  fontSize: number
  lineHeight: number
}

const getStyle = (fontSize: number, lineHeight: number): Style => ({
  fontSize,
  lineHeight,
})

const styles = StyleSheet.create({
  text: {
    fontFamily: Fonts.Medium,
    textAlign: 'center',
    letterSpacing: 0,
  },
  large: {
    ...getStyle(BP({ xsmall: 26, small: 30, medium: 34, large: 34 }), 40),
  },
  medium: {
    ...getStyle(BP({ xsmall: 24, small: 28, medium: 28, large: 28 }), 40),
  },
  small: {
    ...getStyle(18, 24),
    fontFamily: Fonts.Regular,
  },
  shadow: {
    textShadowColor: Colors.white45,
    textShadowOffset: {
      width: 0,
      height: 2,
    },
    textShadowRadius: 18,
  },
})

export default Header
