import React from 'react'
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native'
import { DocumentCard } from '../../documents/components/documentCard'
import { IdentitySummary } from '../../../actions/sso/types'
import { Colors, Spacing } from 'src/styles'
import { CredentialMetadataSummary } from '../../../lib/storage/storage'
import { centeredText, fontMain } from '../../../styles/typography'
import { black065, overflowBlack } from '../../../styles/colors'

interface Props {
  requesterSummary: IdentitySummary | null
  offerMetadata: CredentialMetadataSummary[]
  onPressDocument: (doc: CredentialMetadataSummary) => void
  selectedCredentials: CredentialMetadataSummary[]
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
  logo: {
    borderRadius: 35,
    width: 70,
    height: 70,
    margin: 10,
  },
  serviceName: {
    fontFamily: fontMain,
    fontSize: 28,
    color: overflowBlack,
  },
  description: {
    fontFamily: fontMain,
    fontSize: 16,
    color: black065,
    marginTop: 10,
    marginBottom: 4,
    marginHorizontal: '10%',
    ...centeredText,
  },
  documentWrapper: {
    alignItems: 'center',
    padding: 10,
  },
})

export const CredentialDialogComponent: React.FC<Props> = (
  props: Props,
): JSX.Element => {
  const {
    requesterSummary,
    offerMetadata,
    onPressDocument,
    selectedCredentials,
  } = props
  const publicProfile = requesterSummary && requesterSummary.publicProfile

  return (
    <View style={styles.container}>
      <ScrollView style={{ width: '100%' }}>
        {publicProfile && (
          <View style={styles.topSection}>
            <Image style={styles.logo} source={{ uri: publicProfile.image }} />
            <Text style={styles.serviceName}>{publicProfile.name}</Text>
            <Text style={styles.description}>
              Choose one or more documents provided by this service and we will
              generate them for you
            </Text>
          </View>
        )}
        {offerMetadata.map(summary => {
          const { type, renderInfo } = summary
          const isSelected = selectedCredentials.includes(summary)
          return (
            <TouchableOpacity
              onPress={() => onPressDocument(summary)}
              activeOpacity={1}
              style={styles.documentWrapper}
            >
              <DocumentCard
                selected={isSelected}
                credentialType={type}
                renderInfo={renderInfo}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}
