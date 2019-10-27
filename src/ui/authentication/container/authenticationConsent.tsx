import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO } from 'src/actions/sso'
import { prepareAndSendAuthenticationResponse } from 'src/actions/sso/authenticationRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { AuthenticationRequestSummary } from '../../../actions/sso/types'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'

interface Props extends ReturnType<typeof mapDispatchToProps> {
  interactionRequest: AuthenticationRequestSummary
}

const AuthenticationConsentContainer = ({
  confirmAuthenticationRequest,
  cancelAuthenticationRequest,
  interactionRequest,
}: Props) => (
  <AuthenticationConsentComponent
    authenticationDetails={interactionRequest}
    confirmAuthenticationRequest={() =>
      confirmAuthenticationRequest(false, interactionRequest)
    }
    cancelAuthenticationRequest={cancelAuthenticationRequest}
  />
)

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmAuthenticationRequest: (
    isDeepLinkInteraction: boolean,
    authenticationDetails: AuthenticationRequestSummary,
  ) =>
    dispatch(
      withErrorScreen(
        prepareAndSendAuthenticationResponse(
          isDeepLinkInteraction,
          authenticationDetails,
        ),
      ),
    ),
  cancelAuthenticationRequest: () => dispatch(cancelSSO),
})

export const AuthenticationConsent = withConsentSummary(
  connect(
    null,
    mapDispatchToProps,
  )(AuthenticationConsentContainer),
)
