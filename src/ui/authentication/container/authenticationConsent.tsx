import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO, sendInteractionToken } from 'src/actions/sso'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { AuthenticationRequestSummary } from '../../../actions/sso/types'
import { withInteractionRequestValidation } from '../../generic/consentWithSummaryHOC'

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
    { callbackURL, description, request }: AuthenticationRequestSummary,
  ) =>
    dispatch(
      withErrorScreen(
        async (dispatch, getState, { identityWallet, keyChainLib }) => {
          const authResponse = await identityWallet.create.interactionTokens.response.auth(
            {
              callbackURL,
              description,
            },
            await keyChainLib.getPassword(),
            request,
          )

          return sendInteractionToken(
            isDeepLinkInteraction,
            authResponse,
          ).finally(() => dispatch(cancelSSO()))
        },
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
