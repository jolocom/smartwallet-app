import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO } from 'src/actions/sso'
import { sendAuthenticationResponse } from 'src/actions/sso/authenticationRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { AuthenticationRequestSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { withConsentSummary } from '../../generic/consentWithSummaryHOC'

interface AuthenticationNavigationParams {
  isDeepLinkInteraction: boolean
  jwt: string
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    AuthenticationNavigationParams
  >
  interactionDetails: AuthenticationRequestSummary
}

export const AuthenticationConsentContainer = (props: Props) => {
  const {
    interactionDetails,
    confirmAuthenticationRequest,
    cancelAuthenticationRequest,
    navigation: {
      state: {
        params: { isDeepLinkInteraction },
      },
    },
  } = props
  return (
    <AuthenticationConsentComponent
      authenticationDetails={interactionDetails}
      confirmAuthenticationRequest={() =>
        confirmAuthenticationRequest(isDeepLinkInteraction, interactionDetails)
      }
      cancelAuthenticationRequest={cancelAuthenticationRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmAuthenticationRequest: (
    isDeepLinkInteraction: boolean,
    authenticationDetails: AuthenticationRequestSummary,
  ) =>
    dispatch(
      withErrorScreen(
        sendAuthenticationResponse(
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
