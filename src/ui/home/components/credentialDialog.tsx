import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { prepareLabel } from 'src/lib/util'
import { DocumentCard } from '../../documents/components/documentCard'
import I18n from 'src/locales/i18n'
import { IssuerCard } from '../../documents/components/issuerCard'
import { IdentitySummary } from '../../../actions/sso/types'
import strings from '../../../locales/strings'
import { Colors, Spacing, Typography } from 'src/styles'

interface Props {
  credentialToRender: DecoratedClaims
  requester: IdentitySummary
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGreyLighter,
  },
  topSection: {
    paddingVertical: Spacing.MD,
    alignItems: 'center',
  },
  issuerSection: {},
  sectionHeader: {
    ...Typography.sectionHeader,
    marginTop: Spacing.LG,
    marginBottom: Spacing.SM,
    paddingHorizontal: Spacing.MD,
  },
  claimsSection: {
    // needed to make the ScrollView work properly
    flex: 1,
  },
  claimsList: {
    borderTopWidth: 1,
    borderColor: Colors.lightGrey,
  },
  claimCard: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.MD,
    borderBottomWidth: 1,
    borderColor: Colors.lightGrey,
  },
  claimCardTextContainer: {
    paddingHorizontal: Spacing.XL,
  },
  claimCardTitle: {
    ...Typography.cardSecondaryText,
  },
  claimCardMainText: {
    ...Typography.cardMainText,
  },
})

const renderClaims = (toRender: DecoratedClaims): JSX.Element[] => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <View key={claimData[field]} style={styles.claimCard}>
      <View style={styles.claimCardTextContainer}>
        <Text style={styles.claimCardTitle}>{prepareLabel(field)}</Text>
        <Text style={styles.claimCardMainText}>{claimData[field]}</Text>
      </View>
    </View>
  ))
}

export const CredentialDialogComponent: React.SFC<Props> = (
  props: Props,
): JSX.Element => {
  const { credentialToRender, requester } = props

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <DocumentCard document={credentialToRender} />
      </View>

      <View style={styles.issuerSection}>
        <Text style={styles.sectionHeader}>Issued by </Text>
        {/*  Is the issuer always the same as the document issuer here?  
             If so we can use credentialToRender.issuer */}
        <IssuerCard issuer={requester} />
      </View>

      <View style={styles.claimsSection}>
        <Text style={styles.sectionHeader}>
          {I18n.t(strings.DOCUMENT_DETAILS_CLAIMS)}
        </Text>
        <ScrollView style={styles.claimsList}>
          {renderClaims(credentialToRender)}
        </ScrollView>
      </View>
    </View>
  )
}
