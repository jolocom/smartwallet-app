import React, { useState } from 'react'
import { connect } from 'react-redux'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ThunkDispatch } from '../../../store'
import { acceptSelectedCredentials } from '../../../actions/sso/credentialOfferRequest'
import { CredentialMetadataSummary } from '../../../lib/storage/storage'
import { CredentialOfferResponseSelection } from 'jolocom-lib/js/interactionTokens/interactionTokens.types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { CredentialOfferRequest } from 'jolocom-lib/js/interactionTokens/credentialOfferRequest'
import { IdentitySummary } from '../../../actions/sso/types'
import { JSONWebToken } from 'jolocom-lib/js/interactionTokens/JSONWebToken'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { DocumentCard } from '../../documents/components/documentCard'
import { JolocomButton, Wrapper } from '../../structure'
import { Colors, Spacing } from '../../../styles'
import { centeredText, fontMain } from '../../../styles/typography'
import { black065, overflowBlack } from '../../../styles/colors'
import { ActionSheet } from '../../structure/actionSheet'
import strings from '../../../locales/strings'
import I18n from 'src/locales/i18n'

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

interface CredentialNavigationParams {
  credentialOfferRequest: JSONWebToken<CredentialOfferRequest>
  callbackURL: string
  requesterSummary: IdentitySummary
  offerMetadata: CredentialMetadataSummary[]
  isDeepLink: boolean
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<NavigationState, CredentialNavigationParams>
}

export const CredentialsReceiveContainer = (props: Props) => {
  const [selected, setSelected] = useState<CredentialMetadataSummary[]>([])
  const { navigation, acceptSelectedCredentials, goBack } = props
  const {
    state: {
      params: {
        credentialOfferRequest,
        requesterSummary,
        isDeepLink,
        offerMetadata,
      },
    },
  } = navigation
  const publicProfile = requesterSummary && requesterSummary.publicProfile

  const handleConfirm = () => {
    if (selected.length) {
      const responseSelection: CredentialOfferResponseSelection[] = selected.map(
        credential => {
          return {
            type: credential.type,
            // providedInput ???
          }
        },
      )
      acceptSelectedCredentials(
        responseSelection,
        credentialOfferRequest,
        isDeepLink,
      )
    }
  }

  const onPressDocument = (cred: CredentialMetadataSummary) => {
    if (selected.includes(cred)) {
      setSelected(selected.filter(current => current !== cred))
    } else {
      setSelected([...selected, cred])
    }
  }

  return (
    <Wrapper style={{ backgroundColor: Colors.iBackgroundWhite }}>
      <ScrollView style={{ width: '100%' }}>
        {publicProfile && (
          <View style={styles.topSection}>
            <Image style={styles.logo} source={{ uri: publicProfile.image }} />
            <Text style={styles.serviceName}>{publicProfile.name}</Text>
            <Text style={styles.description}>
              {I18n.t(
                strings.CHOOSE_ONE_OR_MORE_DOCUMENTS_PROVIDED_BY_THIS_SERVICE_AND_WE_WILL_GENERATE_THEM_FOR_YOU,
              )}
            </Text>
          </View>
        )}
        {offerMetadata.map(summary => {
          const { type, renderInfo } = summary
          const isSelected = selected.includes(summary)
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
      <ActionSheet showSlide={true}>
        <JolocomButton
          disabled={selected.length === 0}
          onPress={handleConfirm}
          text={I18n.t(strings.RECEIVE)}
        />
        <JolocomButton
          containerStyle={{ marginTop: 10 }}
          onPress={goBack}
          text={I18n.t(strings.CANCEL)}
          transparent
        />
      </ActionSheet>
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (
    selected: CredentialOfferResponseSelection[],
    credentialOfferRequest: JSONWebToken<CredentialOfferRequest>,
    isDeepLink: boolean,
  ) =>
    dispatch(
      withErrorScreen(
        withLoading(
          acceptSelectedCredentials(
            selected,
            credentialOfferRequest,
            isDeepLink,
          ),
        ),
      ),
    ),
  goBack: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    ),
})

export const CredentialReceive = connect(
  null,
  mapDispatchToProps,
)(CredentialsReceiveContainer)
