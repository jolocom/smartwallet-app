import React from 'react'
import { StyleSheet, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { DocumentCard } from '../../documents/components/documentCard'
import { IdentitySummary } from '../../../actions/sso/types'
import { Colors, Spacing, Typography } from 'src/styles'
import { DocumentDetails as DocumentDetailsComponent } from 'src/ui/documents/components/documentDetails'

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

export const CredentialDialogComponent: React.SFC<Props> = (
  props: Props,
): JSX.Element => {
  const { credentialToRender } = props

  return (
    <View style={styles.container}>
      <View style={styles.topSection}>
        <DocumentCard document={credentialToRender} />
      </View>

      <ScrollView>
        <DocumentDetailsComponent document={credentialToRender} />
      </ScrollView>
    </View>
  )
}
