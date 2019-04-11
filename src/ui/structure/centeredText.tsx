import React from 'react'
import { StyleSheet, TextStyle, Text, StyleProp } from 'react-native'

const styles = StyleSheet.create({
  text: {
    width: '100%',
    textAlign: 'center' as 'center',
    fontSize: 16,
  },
})

interface Props {
  msg: string
  style?: StyleProp<TextStyle>
}

export const CenteredText: React.SFC<Props> = props => (
  <Text style={[styles.text, props.style]}>{props.msg}</Text>
)
