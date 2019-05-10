import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { CredentialTopCard } from './credentialTopCard'
import I18n from 'src/locales/i18n'

interface Props {
  credentialToRender: DecoratedClaims
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: JolocomTheme.secondaryColorGrey,
  },
  topSection: {
    padding: 30,
  },
  issuerSection: {},
  issuerContainer: {
    flexDirection: 'row',
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 20,
    paddingLeft: 15,
    paddingRight: 30,
  },
  issuerIcon: {
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: 42,
    height: 42,
  },
  issuerTextContainer: {
    marginLeft: 16,
    flex: -1,
  },
  sectionHeader: {
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(0, 0, 0, 0.38)',
    marginBottom: 10,
    paddingLeft: 16,
    alignSelf: 'flex-start',
  },
  claimsSection: {
    marginTop: 30,
    flex: 1,
  },
  claimCard: {
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 15,
    marginBottom: 1,
  },
  claimCardTextContainer: {
    paddingHorizontal: 25,
  },
})

const renderIssuerCard = (issuer: string) => {
  return (
    <View style={styles.issuerContainer}>
      <View style={styles.issuerIcon} />
      <View style={styles.issuerTextContainer}>
        <Text
          style={JolocomTheme.textStyles.light.textDisplayField}
          numberOfLines={1}
        >
          {I18n.t('Name of issuer')}
        </Text>
        <Text
          style={[
            JolocomTheme.textStyles.light.labelDisplayField,
            { color: JolocomTheme.primaryColorPurple, opacity: 1 },
          ]}
          numberOfLines={1}
        >
          {issuer}
        </Text>
      </View>
    </View>
  )
}

const renderClaims = (toRender: DecoratedClaims) => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <View key={claimData[field]} style={styles.claimCard}>
      <View style={styles.claimCardTextContainer}>
        <Text
          style={JolocomTheme.textStyles.light.labelDisplayField}
          numberOfLines={1}
        >
          {prepareLabel(field)}
        </Text>
        <Text
          style={JolocomTheme.textStyles.light.textDisplayField}
          numberOfLines={1}
        >
          {/* SHOULD THIS BE LIMITED TO 1 LINE? */}
          {claimData[field]}
        </Text>
      </View>
    </View>
  ))
}

export const CredentialDialogComponent: React.SFC<Props> = props => {
  const { credentialToRender } = props
  const { expires, credentialType, issuer } = credentialToRender

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <CredentialTopCard
          credentialName={credentialType}
          expiryDate={expires}
        />
      </View>

      <View style={styles.issuerSection}>
        <Text style={styles.sectionHeader}>Issued by </Text>
        {renderIssuerCard(issuer)}
      </View>

      <View style={styles.claimsSection}>
        <Text style={styles.sectionHeader}>
          {I18n.t('Document details/claims')}
        </Text>
        <ScrollView>{renderClaims(credentialToRender)}</ScrollView>
      </View>
    </View>
  )
}
