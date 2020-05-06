import React from 'react'
import { Text, StyleSheet } from 'react-native'

import { Colors } from '~/utils/colors'
import { TextStyle } from '~/utils/fonts'

export enum ParagraphSize {
  medium,
  large,
}

interface PropsI {
  color?: Colors
  size?: ParagraphSize
}

const Paragraph: React.FC<PropsI> = ({
  children,
  size = ParagraphSize.medium,
  color = Colors.white,
}) => {
  const sizeStyle = size === ParagraphSize.medium ? styles.medium : styles.large
  return (
    <Text testID="paragraph" style={[styles.paragraph, { color }, sizeStyle]}>
      {children}
    </Text>
  )
}

const styles = StyleSheet.create({
  paragraph: {
    textAlign: 'center',
    paddingHorizontal: 10,
    marginVertical: 5,
  },
  medium: {
    ...TextStyle.middleSubtitle,
  },
  large: {
    ...TextStyle.largeSubtitle,
  },
})

export default Paragraph
