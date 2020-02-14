import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { IdentitySummary } from '../../../actions/sso/types'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { JolocomButton, Wrapper } from '../../structure'
import { Colors } from '../../../styles'
import { fontMedium } from '../../../styles/typography'
import { ActionSheet } from '../../structure/actionSheet'
import strings from '../../../locales/strings'
import I18n from 'src/locales/i18n'
import { CredentialOffering } from '../../../lib/interactionManager/credentialOfferFlow'
import { saveCredentialOffer } from '../../../actions/sso/credentialOfferRequest'
import { CredentialReceiveComponent } from '../components/credentialReceive'

export interface CredentialOfferNavigationParams {
  requesterSummary: IdentitySummary
  credentialOffering: CredentialOffering[]
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialOfferNavigationParams
  >
}

export const CredentialsReceiveInvalidContainer = (props: Props) => {
  const [selected, setSelected] = useState<CredentialOffering[]>([])
  const { navigation, acceptSelectedCredentials, goBack } = props
  const {
    state: {
      params: { requesterSummary, credentialOffering },
    },
  } = navigation
  const publicProfile = requesterSummary && requesterSummary.publicProfile

  const handleConfirm = () => {
    acceptSelectedCredentials(selected)
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
        credentialOffering={credentialOffering}
        publicProfile={publicProfile}
        isDocumentSelected={isDocumentSelected}
        onPressDocument={onPressDocument}
        isInvalidScreen={true}
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
  acceptSelectedCredentials: (selected: CredentialOffering[]) =>
    dispatch(withErrorScreen(withLoading(saveCredentialOffer(selected)))),
  goBack: () =>
    dispatch(
      navigationActions.navigate({ routeName: routeList.InteractionScreen }),
    ),
})

export const CredentialReceiveIvalid = connect(
  null,
  mapDispatchToProps,
)(CredentialsReceiveInvalidContainer)
