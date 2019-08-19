import React, { ReactNode } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Spacing, Colors, Typography } from '../../styles'

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: Spacing.MD,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.XS,
  },
  rightSection: {
    flex: 1,
    marginLeft: Spacing.LG,
  },
  mainInfo: {
    ...Typography.cardMainText,
    marginTop: Spacing.SM,
  },
})

/**
 * |------------------------------------------------------|
 * | left  |             title                            |
 * | Icon  |----------------------------------------------|
 * |       |                                              |
 * |       |            children                          |
 * |       |                                              |
 * |       |                                              |
 * |       |                                              |
 * |-------|----------------------------------------------|
 */

interface CardWrapperProps {
  leftIcon?: ReactNode
  title: string
}

export const CardWrapper: React.FC<CardWrapperProps> = (props): JSX.Element => (
  <View style={styles.card}>
    {props.leftIcon && (
      <View style={styles.leftIconSection}>{props.leftIcon}</View>
    )}
    <View style={styles.rightSection}>
      <Text style={Typography.cardSecondaryTextBlack}>{props.title}:</Text>
      {props.children}
    </View>
  </View>
)
