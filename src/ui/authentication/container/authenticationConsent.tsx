import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO } from 'src/actions/sso'
import { sendAuthenticationResponse } from 'src/actions/sso/authenticationRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { AuthenticationRequestSummary } from '../../../actions/sso/types'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { SendResponse } from 'src/lib/transportLayers'

interface AuthenticationNavigationParams {
  send: SendResponse,
  authenticationDetails: AuthenticationRequestSummary
}

interface Props extends ReturnType<typeof mapDispatchToProps> {
  navigation: NavigationScreenProp<
    NavigationState,
    AuthenticationNavigationParams
  >
}

export const AuthenticationConsentContainer = (props: Props) => {
  const {
    confirmAuthenticationRequest,
    cancelAuthenticationRequest,
    navigation: {
      state: {
        params: { send, authenticationDetails },
      },
    },
  } = props
  return (
    <AuthenticationConsentComponent
      authenticationDetails={authenticationDetails}
      confirmAuthenticationRequest={() =>
        confirmAuthenticationRequest(
          send,
          authenticationDetails,
        )
      }
      cancelAuthenticationRequest={cancelAuthenticationRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmAuthenticationRequest: (
    send: SendResponse,
    authenticationDetails: AuthenticationRequestSummary
  ) =>
    dispatch(
      withErrorScreen(
        sendAuthenticationResponse(
          send,
          authenticationDetails,
        ),
      ),
    ),
  cancelAuthenticationRequest: () => dispatch(cancelSSO),
})

export const AuthenticationConsent = connect(
  null,
  mapDispatchToProps,
)(AuthenticationConsentContainer)
