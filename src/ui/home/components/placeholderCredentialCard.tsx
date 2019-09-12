import React from 'react'
import { CardWrapper } from 'src/ui/structure'
import { View, StyleSheet, Text } from 'react-native'
import { Typography } from 'src/styles'
import { DecoratedClaims } from 'src/reducers/account'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { credentialStyles } from './sharedConstants'

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
})

interface Props {
  onPress: () => void
  credential: DecoratedClaims
  leftIcon: React.ReactNode
}

/**
 * PlaceholderCredentialCard is used to render the default credential cards (e.g.
 * Name, Email) when they are empty.
 */
export const PlaceholderCredentialCard: React.FC<Props> = props => {
  const {
    credential: { credentialType },
    onPress,
    leftIcon,
  } = props
  return (
    <CardWrapper style={styles.card}>
      {leftIcon && leftIcon}
      <View style={credentialStyles.claimsArea}>
        <Text style={Typography.cardSecondaryTextBlack}>
          {I18n.t(credentialType)}
        </Text>
        <Text onPress={onPress} style={Typography.cardMainTextPurple}>
          + {I18n.t(strings.ADD)}
        </Text>
      </View>
    </CardWrapper>
  )
}
