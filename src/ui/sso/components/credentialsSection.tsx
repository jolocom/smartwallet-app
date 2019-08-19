import React from 'react'
import { CardWrapper } from 'src/ui/structure'
import { getCredentialIconByType } from 'src/resources/util'
import { StyleSheet, View, Text } from 'react-native'
import { Spacing, Typography, Colors } from 'src/styles'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { IdentitySummary } from 'src/actions/sso/types'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { IconToggle } from 'react-native-material-ui'

interface CredentialSectionProps {
  did: string
  sectionType: string
  credentials: StateTypeSummary[]
  selectedCredential: StateVerificationSummary | undefined
  onPress: (type: string, newSelected: StateVerificationSummary) => void
}

export const CredentialSection: React.FC<CredentialSectionProps> = props => {
  const { sectionType, did, credentials, selectedCredential, onPress } = props
  return (
    <CardWrapper
      title={sectionType}
      leftIcon={getCredentialIconByType(sectionType)}
    >
      {credentials.map(credential => {
        const { values, verifications, type } = credential
        const isSelected =
          selectedCredential && selectedCredential.id === verifications[0].id

        return values.length === 0 ? (
          <View style={{ marginTop: Spacing.SM }}>
            <Text style={styles.claimText}>
              {I18n.t(strings.NO_LOCAL_CLAIMS)}
            </Text>
          </View>
        ) : (
          <CheckboxCredential
            selectedCredential={selectedCredential}
            did={did}
            credential={credential}
            isSelected={!!isSelected}
            issuer={(verifications[0] && verifications[0].issuer) || {}}
            onPress={() => onPress(type, verifications[0])}
          />
        )
      })}
    </CardWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: Spacing.SM,
  },
  claimArea: {
    flex: 1,
  },
  rightIconArea: {},
  claimText: {
    ...Typography.cardMainText,
    marginTop: Spacing.XXS,
  },
  issuerStatusContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: Spacing.XXS,
  },
  issuerStatusText: {
    ...Typography.cardSecondaryText,
    marginLeft: Spacing.XXS,
  },
})

interface CheckboxCredentialProps {
  credential: StateTypeSummary
  selectedCredential: StateVerificationSummary | undefined
  did: string
  isSelected: boolean
  issuer: IdentitySummary
  onPress: () => void
}

export const CheckboxCredential: React.FC<CheckboxCredentialProps> = props => {
  const { credential, did, issuer, isSelected, onPress } = props
  const { values } = credential
  const selfSigned = did === issuer.did
  const status = { color: selfSigned ? Colors.blackMain040 : Colors.greenMain }

  return (
    <View style={styles.container}>
      <View style={styles.claimArea}>
        {values.map(value => (
          <Text style={styles.claimText}>{value}</Text>
        ))}
        <View style={styles.issuerStatusContainer}>
          <Icon name="check-all" size={Typography.textXS} style={status} />
          <Text style={[styles.issuerStatusText, status]} numberOfLines={1}>
            {selfSigned ? I18n.t(strings.SELF_SIGNED) : issuer.did}
          </Text>
        </View>
      </View>

      <View style={styles.rightIconArea}>
        <IconToggle
          name={isSelected ? 'check-circle' : 'fiber-manual-record'}
          color={isSelected ? Colors.purpleMain : Colors.lightGrey}
          onPress={onPress}
        />
      </View>
    </View>
  )
}
