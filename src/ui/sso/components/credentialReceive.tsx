import { Colors, Spacing } from '../../../styles'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import I18n from '../../../locales/i18n'
import strings from '../../../locales/strings'
import { DocumentCard } from '../../documents/components/documentCard'
import { centeredText, fontMain, fontMedium } from '../../../styles/typography'
import React from 'react'
import { black065, overflowBlack } from '../../../styles/colors'
import { IssuerPublicProfileSummary } from '../../../actions/sso/types'
import { CredentialOffering } from '../../../lib/interactionManager/types'

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
    fontFamily: fontMedium,
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

interface Props {
  publicProfile: IssuerPublicProfileSummary
  credentialOffering: CredentialOffering[]
  onPressDocument: (offering: CredentialOffering) => void
  isDocumentSelected: (offering: CredentialOffering) => boolean
}

export const CredentialReceiveComponent = (props: Props) => {
  const {
    publicProfile,
    credentialOffering,
    isDocumentSelected,
    onPressDocument,
  } = props

  return (
    <React.Fragment>
      <View style={styles.topSection}>
        {publicProfile && (
          <React.Fragment>
            <Image style={styles.logo} source={{ uri: publicProfile.image }} />
            <Text style={styles.serviceName}>{publicProfile.name}</Text>
          </React.Fragment>
        )}
        <Text style={styles.description}>
          {I18n.t(
            strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_PROVIDED_BY_THIS_SERVICE_AND_WE_WILL_GENERATE_THEM_FOR_YOU,
          )}
        </Text>
      </View>
      <ScrollView
        contentContainerStyle={{ paddingBottom: '50%' }}
        style={{ width: '100%' }}
      >
        {credentialOffering.map(offering => {
          const { type, renderInfo, valid } = offering
          //const isSelected = isDocumentSelected(offering)
          return (
            <TouchableOpacity
              onPress={() => valid && onPressDocument(offering)}
              activeOpacity={1}
              style={styles.documentWrapper}
            >
              <DocumentCard
                credentialType={type}
                renderInfo={renderInfo}
                invalid={!valid}
              />
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </React.Fragment>
  )
}
