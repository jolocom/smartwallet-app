import React from 'react'
import { CardWrapper } from 'src/ui/structure'
import { View, StyleSheet, Text } from 'react-native'
import { getCredentialIconByType } from 'src/resources/util'
import { Spacing, Typography } from 'src/styles'
import { DecoratedClaims } from 'src/reducers/account'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'

const styles = StyleSheet.create({
  card: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  leftIconSection: {
    paddingHorizontal: Spacing.XS,
  },
  claimsArea: {
    flex: 1,
    marginLeft: Spacing.LG,
  },
  rightIconArea: {},
})

interface Props {
  credential: DecoratedClaims
  onPress: () => void
}

/**
 * PlaceholderCredentialCard is used to render the default credential cards (e.g.
 * Name, Email) when they are empty.
 */
export const PlaceholderCredentialCard: React.FC<Props> = props => {
  const {
    credential: { credentialType },
    onPress,
  } = props
  return (
    <CardWrapper style={styles.card}>
      <View style={styles.leftIconSection}>
        {getCredentialIconByType(credentialType)}
      </View>
      <View style={styles.claimsArea}>
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
