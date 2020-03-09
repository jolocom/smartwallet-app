import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
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
import { consumeCredentialReceive } from '../../../actions/sso/credentialOffer'
import { CredentialReceiveComponent } from '../components/credentialReceive'
import { CredentialOffering } from '../../../lib/interactionManager/types'
import { InteractionSummary } from '../../../actions/sso/types'

export interface CredentialOfferNavigationParams {
  interactionId: string
  interactionSummary: InteractionSummary
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
      params: { interactionSummary, interactionId },
    },
  } = navigation

  const { publicProfile } = interactionSummary.issuer
  // TODO fix the `any` type from interaction summary state
  const credentialOffering = interactionSummary.state as CredentialOffering[]

  const handleConfirm = () => {
    acceptSelectedCredentials(selected, interactionId)
  }

  const toggleSelect = (offering: CredentialOffering) => {
    setSelected(prevState => {
      return isDocumentSelected(offering)
        ? prevState.filter(current => current !== offering)
        : [...prevState, offering]
    })
  }

  const isDocumentSelected = (offering: CredentialOffering) =>
    selected.includes(offering)

  return (
    <Wrapper style={{ backgroundColor: Colors.iBackgroundWhite }}>
      <CredentialReceiveComponent
        credentialOffering={credentialOffering}
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
