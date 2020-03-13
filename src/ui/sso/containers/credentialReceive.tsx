import React, { useState } from 'react'
import { connect } from 'react-redux'
import { ThunkDispatch } from '../../../store'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { withErrorScreen, withLoading } from '../../../actions/modifiers'
import { navigationActions } from '../../../actions'
import { routeList } from '../../../routeList'
import { Wrapper } from '../../structure'
import { Colors } from '../../../styles'
import { consumeCredentialReceive } from '../../../actions/sso/credentialOffer'
import { CredentialReceiveComponent } from '../components/credentialReceive'
import {
  InteractionSummary,
  SignedCredentialWithMetadata,
} from '../../../lib/interactionManager/types'
import { OfferWithValidity } from 'src/lib/interactionManager/credentialOfferFlow'
import { ButtonSheet } from 'src/ui/structure/buttonSheet'

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
  const [selected, setSelected] = useState<SignedCredentialWithMetadata[]>([])
  const { navigation, acceptSelectedCredentials, goBack } = props
  const {
    state: {
      params: { interactionSummary, interactionId },
    },
  } = navigation

  const { publicProfile } = interactionSummary.issuer

  const handleConfirm = () => {
    acceptSelectedCredentials(selected, interactionId)
    setSelected([])
  }

  const toggleSelectDocument = (cred: SignedCredentialWithMetadata) => {
    setSelected(prevState =>
      isDocumentSelected(cred)
        ? prevState.filter(current => current !== cred)
        : [...prevState, cred],
    )
  }

  const isDocumentSelected = (offering: SignedCredentialWithMetadata) =>
    selected.includes(offering)

  return (
    <Wrapper style={{ backgroundColor: Colors.iBackgroundWhite }}>
      <CredentialReceiveComponent
        credentialOfferSummary={interactionSummary.state as OfferWithValidity[]}
        publicProfile={publicProfile}
        isDocumentSelected={isDocumentSelected}
        onToggleSelect={toggleSelectDocument}
      />
      <ButtonSheet
        onConfirm={handleConfirm}
        onCancel={goBack}
        disabledConfirm={selected.length === 0}
      />
    </Wrapper>
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  acceptSelectedCredentials: (
    selected: SignedCredentialWithMetadata[],
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
