import React, { useState } from 'react'
import { connect } from 'react-redux'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { ButtonSection } from 'src/ui/structure/buttonSectionBottom'
import { View } from 'react-native'
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
    <View style={{ flex: 1 }}>
      <View style={{ flex: 0.9 }}>
        <CredentialDialogComponent
          requesterSummary={requesterSummary}
          offerMetadata={offerMetadata}
          onPressDocument={onPressDocument}
          selectedCredentials={selected}
        />
      </View>
      <View style={{ flex: 0.1 }}>
        <ButtonSection
          confirmText={'Accept'}
          denyText={'Deny'}
          handleConfirm={handleConfirm}
          handleDeny={goBack}
          disabled={false}
        />
      </View>
    </View>
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
