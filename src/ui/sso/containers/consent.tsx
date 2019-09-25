import React from 'react'
import { connect } from 'react-redux'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from 'src/store'
import { withLoading, withErrorScreen } from 'src/actions/modifiers'
import {
  CredentialRequestSummary,
  CredentialVerificationSummary,
} from '../../../actions/sso/types'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: {
    state: {
      params: {
        isDeepLinkInteraction: boolean
        credentialRequestDetails: CredentialRequestSummary
      }
    }
  }
}

const ConsentContainer = (props: Props) => {
  const {
    currentDid,
    sendCredentialResponse,
    cancelSSO,
    navigation: {
      state: {
        params: { isDeepLinkInteraction, credentialRequestDetails },
      },
    },
  } = props

  const handleSubmitClaims = (credentials: CredentialVerificationSummary[]) => {
    sendCredentialResponse(
      credentials,
      credentialRequestDetails,
      isDeepLinkInteraction,
    )
  }

  const {
    availableCredentials,
    requester,
    callbackURL,
  } = credentialRequestDetails
  return (
    <ConsentComponent
      requester={requester}
      callbackURL={callbackURL}
      did={currentDid}
      availableCredentials={availableCredentials}
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
    credentialRequestDetails: CredentialRequestSummary,
    isDeepLinkInteraction: boolean,
  ) =>
    dispatch(
      withLoading(
        withErrorScreen(
          ssoActions.sendCredentialResponse(
            credentials,
            credentialRequestDetails,
            isDeepLinkInteraction,
          ),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const Consent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentContainer)
