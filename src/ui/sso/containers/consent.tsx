import React from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import {
  CredentialTypeSummary,
  CredentialVerificationSummary,
  CredentialRequestFlowState,
} from 'src/lib/interactionManager/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { InteractionSummary } from '../../../lib/interactionManager/types'

interface CredentialRequestNavigationParams {
  interactionId: string
  interactionSummary: InteractionSummary
}

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    CredentialRequestNavigationParams
  >
}

const ConsentContainer = (props: Props) => {
  const {
    currentDid,
    sendCredentialResponse,
    cancelSSO,
    navigation: {
      state: {
        params: { interactionId, interactionSummary },
      },
    },
  } = props

  const handleSubmitClaims = (credentials: CredentialVerificationSummary[]) => {
    sendCredentialResponse(credentials, interactionId)
  }

  const { issuer, state } = interactionSummary

  // TODO Instead of "as", use type guards?
  return (
    <ConsentComponent
      requester={issuer}
      did={currentDid}
      availableCredentials={
        (state as CredentialRequestFlowState).availableCredentials
      }
      handleSubmitClaims={handleSubmitClaims}
      handleDenySubmit={cancelSSO}
    />
  )
}

const mapStateToProps = (state: any) => ({
  currentDid: state.account.did.did,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  sendCredentialResponse: (
    credentials: CredentialVerificationSummary[],
    interactionId: string,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          ssoActions.sendCredentialResponse(credentials, interactionId),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const Consent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentContainer)
