import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native'
import { Spacing, Colors } from '../../styles'

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: 'row',
    padding: Spacing.MD,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.XS,
  },
  mainSection: {
    flex: 1,
  },
})

interface CardWrapperProps {
  leftIcon?: ReactNode
  style?: StyleProp<ViewStyle>
}

/**
 * CardWrapper is the base building block of most cards.
 *
 * It provides top and bottom padding, and a border color, but is generally
 * unopinionated. Currently accepts an optional leftIcon prop, but this may change.
 */

export const CardWrapper: React.FC<CardWrapperProps> = (props): JSX.Element => (
  <View style={[styles.card, props.style]}>
    {props.leftIcon && (
      <View style={styles.leftIconSection}>{props.leftIcon}</View>
    )}
    <View style={styles.mainSection}>{props.children}</View>
  </View>
)
