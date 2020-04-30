import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { Colors } from '~/utils/colors'

export enum HeaderSizes {
  large,
  medium,
  small,
}

interface PropsI {
  size?: HeaderSizes
  color?: Colors
}

const Header: React.FC<PropsI> = ({
  size = HeaderSizes.medium,
  children,
  color = Colors.white,
}) => {
  return (
    <Text
      testID={'header'}
      style={[
        styles.text,
        size === HeaderSizes.large
          ? styles.large
          : size === HeaderSizes.medium
          ? styles.medium
          : styles.small,
        { color },
      ]}
    >
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'TTCommons-Medium',
    marginVertical: 2,
    marginHorizontal: 3,
  },
  large: {
    fontSize: 34,
  },
  medium: {
    fontSize: 28,
  },
  small: {
    fontSize: 26,
  },
})

export default Header
