import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO, InteractionTokenSender } from 'src/actions/sso'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { AuthenticationRequestSummary } from '../../../actions/sso/types'
import { withInteractionRequestValidation } from '../../generic/consentWithSummaryHOC'

interface Props extends ReturnType<typeof mapDispatchToProps> {
  interactionRequest: AuthenticationRequestSummary
  sendResponse: InteractionTokenSender
}

const AuthenticationConsentContainer = ({
  sendResponse,
  generateAndSendAuthenticationResponse,
  cancelAuthenticationRequest,
  interactionRequest,
}: Props) => (
  <AuthenticationConsentComponent
    authenticationDetails={interactionRequest}
    generateAndSendAuthenticationResponse={() =>
      generateAndSendAuthenticationResponse(interactionRequest, sendResponse)
    }
    cancelAuthenticationRequest={cancelAuthenticationRequest}
  />
)

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  generateAndSendAuthenticationResponse: (
    { callbackURL, description, request }: AuthenticationRequestSummary,
    sendResponse: InteractionTokenSender,
  ) =>
    dispatch(
      withErrorScreen(
        async (dispatch, getState, { identityWallet, keyChainLib }) =>
          sendResponse(
            await identityWallet.create.interactionTokens.response.auth(
              {
                callbackURL,
                description,
              },
              await keyChainLib.getPassword(),
              request,
            ),
          ),
      ),
    ),
  cancelAuthenticationRequest: () => dispatch(cancelSSO),
})

export const AuthenticationConsent = withInteractionRequestValidation(
  connect(
    null,
    mapDispatchToProps,
  )(AuthenticationConsentContainer),
)
