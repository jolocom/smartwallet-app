import React, { ReactNode } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Spacing, Colors, Typography } from '../../styles'

/**
 * |------------------------------------------------------|
 * | left  |             title                            |
 * | Icon  |----------------------------------------------|
 * |       |                                              |
 * |       |            primaryText                       |
 * |       |           (secondaryText)                    |
 * |       |                                              |
 * |       |                                              |
 * |-------|----------------------------------------------|
 */

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    paddingVertical: Spacing.MD,
    backgroundColor: Colors.white,
    borderColor: Colors.lightGrey,
    borderBottomWidth: 1,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.MD,
  },
  rightSection: {
    paddingHorizontal: Spacing.MD,
  },
  mainInfo: {
    ...Typography.cardMainText,
    marginTop: Spacing.SM,
  },
})

interface WrappedCardProps {
  leftIcon?: ReactNode
  title: string
  primaryText: string
  secondaryText?: string
}

export const WrappedCard: React.FC<WrappedCardProps> = (props): JSX.Element => (
  <View style={styles.card}>
    {props.leftIcon && (
      <View style={styles.leftIconSection}>{props.leftIcon}</View>
    )}
    <View style={styles.rightSection}>
      <Text style={Typography.cardSecondaryTextBlack}>{props.title}</Text>
      <Text style={styles.mainInfo} numberOfLines={1}>
        {props.primaryText}
      </Text>
      {props.secondaryText && (
        <Text style={Typography.cardSecondaryText} numberOfLines={1}>
          {props.secondaryText}
        </Text>
      )}
    </View>
  </View>
)
