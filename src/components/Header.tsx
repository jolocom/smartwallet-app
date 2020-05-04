import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'
import { Fonts } from '~/utils/fonts'

export enum HeaderSizes {
  large = 'large',
  medium = 'medium',
  small = 'small',
}

interface PropsI {
  size?: HeaderSizes
  hasShadow?: boolean
  color?: Colors
}

const Header: React.FC<PropsI> = ({
  size = HeaderSizes.medium,
  hasShadow = false,
  color = Colors.white,
  children,
}) => {
  return (
    <Text
      testID="header"
      style={[styles.text, styles[size], { color }, hasShadow && styles.shadow]}
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
    marginVertical: 5,
  },
  large: {
    ...getStyle(40, 54),
  },
  medium: {
    ...getStyle(34, 40),
  },
  small: {
    ...getStyle(28, 40),
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
