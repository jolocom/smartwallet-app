import React from 'react'
import { StyleSheet, Text, ScrollView, View } from 'react-native'
import { DecoratedClaims } from 'src/reducers/account'
import { JolocomTheme } from 'src/styles/jolocom-theme'
import { prepareLabel } from 'src/lib/util'
import { DocumentCard } from '../../documents/components/documentCard'
import { IdentitySummary } from '../../../actions/sso/types'
import { DocumentDetails as DocumentDetailsComponent } from 'src/ui/documents/components/documentDetails'

interface Props {
  credentialToRender: DecoratedClaims
  requester: IdentitySummary
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
    paddingVertical: 18,
    paddingLeft: 15,
    paddingRight: 30,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  issuerIcon: {
    backgroundColor: JolocomTheme.primaryColorGrey,
    width: 42,
    height: 42,
  },
  issuerTextContainer: {
    marginLeft: 16,
  },
  issuerText: {
    fontSize: 17,
    color: JolocomTheme.primaryColorPurple,
    fontFamily: JolocomTheme.contentFontFamily,
  },
  sectionHeader: {
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
    color: 'rgba(0, 0, 0, 0.4)',
    marginBottom: 10,
    paddingLeft: 16,
    alignSelf: 'flex-start',
  },
  claimsSection: {
    marginTop: 30,
    flex: 1,
  },
  claimsList: {
    borderTopWidth: 1,
    borderColor: '#ececec',
  },
  claimCard: {
    backgroundColor: JolocomTheme.primaryColorWhite,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  claimCardTextContainer: {
    paddingHorizontal: 30,
  },
  claimCardTitle: {
    color: 'rgba(0, 0, 0, 0.4)',
    fontSize: 17,
    fontFamily: JolocomTheme.contentFontFamily,
  },
})

const renderClaims = (toRender: DecoratedClaims): JSX.Element[] => {
  const { claimData } = toRender
  return Object.keys(claimData).map(field => (
    <View key={claimData[field]} style={styles.claimCard}>
      <View style={styles.claimCardTextContainer}>
        <Text style={styles.claimCardTitle}>{prepareLabel(field)}</Text>
        <Text style={JolocomTheme.textStyles.light.textDisplayField}>
          {claimData[field]}
        </Text>
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

      <ScrollView>
        <DocumentDetailsComponent document={credentialToRender} />
      </ScrollView>
    </View>
  )
}
