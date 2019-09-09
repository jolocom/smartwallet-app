import React from 'react'
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native'
import { sandLight } from '../../styles/colors'
import { baseFontStyles, textLG } from '../../styles/typography'

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: sandLight,
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 30,
    paddingVertical: 5,
    margin: 10,
  },
  text: { color: sandLight, ...baseFontStyles, fontSize: textLG },
})

interface Props extends TouchableHighlightProps {
  text: string
}
export const TransparentButton: React.FC<Props> = props => {
  const { style, text, ...otherProps } = props
  return (
    <TouchableHighlight style={[styles.container, style]} {...otherProps}>
      <Text style={styles.text}>{text}</Text>
    </TouchableHighlight>
  )
}
