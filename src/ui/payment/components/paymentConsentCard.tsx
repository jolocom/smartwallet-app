import React, { ReactNode } from 'react'
import { View, StyleSheet, Text } from 'react-native'
import { Spacing, Typography } from 'src/styles'
import { CardWrapper } from 'src/ui/structure'

const styles = StyleSheet.create({
  card: {
    // prevent the cards from filling the space
    flex: 0,
    borderBottomWidth: 1,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.MD,
  },
  rightSection: {
    flex: 1,
    paddingHorizontal: Spacing.MD,
  },
  mainInfo: {
    ...Typography.cardMainText,
    marginTop: Spacing.SM,
  },
})

interface Props {
  leftIcon?: ReactNode
  title: string
  primaryText: string
  secondaryText?: string
}

export const PaymentConsentCard: React.FC<Props> = (props): JSX.Element => (
  <CardWrapper style={styles.card}>
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
  </CardWrapper>
)
