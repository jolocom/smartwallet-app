import React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import I18n from 'src/locales/i18n'
import { CardWrapper } from 'src/ui/structure'
import { Spacing, Typography } from 'src/styles'
import { getCredentialIconByType } from 'src/resources/util'
import MoreIcon from 'src/resources/svg/MoreIcon'
import { prepareLabel } from 'src/lib/util'

interface Props {
  onPress?: () => void
  did: string
  credential: DecoratedClaims
}

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

/**
 * CredentialCard renders a credential with its labels and values for each of its
 * claims.
 */
export const CredentialCard: React.FC<Props> = props => {
  const {
    credential: { credentialType, claimData, issuer },
    did,
    onPress,
  } = props
  const selfSigned = issuer.did === did

  return (
    <CardWrapper style={styles.card}>
      <View style={styles.leftIconSection}>
        {getCredentialIconByType(credentialType)}
      </View>
      <View style={styles.claimsArea}>
        {Object.keys(claimData).map(key => (
          <View style={{ marginTop: Spacing.XXS }} key={key}>
            <Text style={{ ...Typography.cardSecondaryText }}>
              {prepareLabel(I18n.t(key))}
            </Text>
            <Text style={{ ...Typography.cardMainText }}>
              {I18n.t(claimData[key])}
            </Text>
          </View>
        ))}
      </View>
      {selfSigned && (
        <View style={styles.rightIconArea} onTouchEnd={onPress}>
          <MoreIcon />
        </View>
      )}
    </CardWrapper>
  )
}
