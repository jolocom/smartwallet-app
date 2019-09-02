import React from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Spacing, Colors } from '../../styles'

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.MD,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
  },
})

interface CardWrapperProps {
  style?: StyleProp<ViewStyle>
}

/**
 * CardWrapper is the base building block of most cards.
 *
 * It provides top and bottom padding, and a border color, but is generally
 * unopinionated.
 */

export const CardWrapper: React.FC<CardWrapperProps> = (props): JSX.Element => (
  <View style={[styles.card, props.style]}>{props.children}</View>
)
