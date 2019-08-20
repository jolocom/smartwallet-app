import React from 'react'
import { CardWrapper } from 'src/ui/structure'
import { getCredentialIconByType } from 'src/resources/util'
import { StyleSheet, View, Text } from 'react-native'
import { Spacing, Typography } from 'src/styles'
import { StateTypeSummary, StateVerificationSummary } from 'src/reducers/sso'
import I18n from 'src/locales/i18n'
import strings from 'src/locales/strings'
import { CheckboxCredential } from './checkboxCredential'

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
  },
  credentialsArea: {
    marginLeft: Spacing.LG,
  },
  noClaimsText: {
    ...Typography.cardMainText,
    marginTop: Spacing.SM,
  },
})

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
      leftIcon={getCredentialIconByType(sectionType)}
      style={styles.card}
    >
      <View style={styles.credentialsArea}>
        {/* Title for the section */}
        <Text style={Typography.cardSecondaryTextBlack}>{sectionType}:</Text>

        {/* Credentials in each section */}
        {credentials.map(credential => {
          const { values, verifications, type } = credential
          const isSelected =
            selectedCredential && selectedCredential.id === verifications[0].id

          return values.length === 0 ? (
            <View>
              <Text style={styles.noClaimsText}>
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
      </View>
    </CardWrapper>
  )
}
