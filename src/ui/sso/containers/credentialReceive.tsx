import React, { useState } from 'react'
import { connect } from 'react-redux'
import { backendMiddleware, ThunkDispatch } from '../../../store'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { JolocomButton, Wrapper } from '../../structure'
import { Colors } from '../../../styles'
import { fontMedium } from '../../../styles/typography'
import { ActionSheet } from '../../structure/actionSheet'
import strings from '../../../locales/strings'
import I18n from 'src/locales/i18n'
import { CredentialOfferFlow } from '../../../lib/interactionManager/credentialOfferFlow'
import { consumeCredentialReceive } from '../../../actions/sso/credentialOffer'
import { CredentialReceiveComponent } from '../components/credentialReceive'
import { CredentialOffering } from '../../../lib/interactionManager/types'

export interface CredentialOfferNavigationParams {
  interactionId: string
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialOfferNavigationParams
  >
}

export const CredentialsReceiveContainer = (props: Props) => {
  const [selected, setSelected] = useState<CredentialOffering[]>([])
  const { navigation, acceptSelectedCredentials, goBack } = props
  const {
    state: {
      params: { interactionId },
    },
  } = navigation
  const interaction = backendMiddleware.interactionManager.getInteraction(
    interactionId,
  )
  const { publicProfile } = interaction.issuerSummary
  const { credentialOfferingState } = interaction.getFlow<CredentialOfferFlow>()

  const handleConfirm = () => {
    acceptSelectedCredentials(selected, interactionId)
  }

  const onPressDocument = (cred: CredentialOffering) => {
    if (selected.includes(cred)) {
      setSelected(selected.filter(current => current !== cred))
    } else {
      setSelected([...selected, cred])
    }
  }

  const isDocumentSelected = (offering: CredentialOffering) =>
    selected.includes(offering)

  return (
    <Wrapper style={{ backgroundColor: Colors.iBackgroundWhite }}>
      <CredentialReceiveComponent
        credentialOffering={credentialOfferingState}
        publicProfile={publicProfile}
        isDocumentSelected={isDocumentSelected}
        onPressDocument={onPressDocument}
      />
      <ActionSheet showSlide={true}>
        <JolocomButton
          textStyle={{ fontFamily: fontMedium }}
          disabled={selected.length === 0}
          onPress={handleConfirm}
          text={I18n.t(strings.SAVE)}
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
    selected: CredentialOffering[],
    interactionId: string,
  ) =>
    dispatch(
      withErrorScreen(
        withLoading(consumeCredentialReceive(selected, interactionId)),
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
