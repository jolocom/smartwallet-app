import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/authenticationConsent'
import { cancelSSO } from 'src/actions/sso'
import { sendAuthenticationResponse } from 'src/actions/sso/authenticationRequest'
import { ThunkDispatch } from 'src/store'
import { withErrorScreen } from 'src/actions/modifiers'
import { NavigationScreenProp, NavigationState } from 'react-navigation'
import { InteractionSummary } from '../../../lib/interactionManager/types'

interface AuthenticationNavigationParams {
  interactionId: string
  interactionSummary: InteractionSummary
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
        params: { interactionId, interactionSummary },
      },
    },
  } = props
  return (
    <AuthenticationConsentComponent
      interactionSummary={interactionSummary}
      confirmAuthenticationRequest={() =>
        confirmAuthenticationRequest(interactionId)
      }
      cancelAuthenticationRequest={cancelAuthenticationRequest}
    />
  )
}

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmAuthenticationRequest: (interactionId: string) =>
    dispatch(withErrorScreen(sendAuthenticationResponse(interactionId))),
  cancelAuthenticationRequest: () => dispatch(cancelSSO),
})

export const AuthenticationConsent = connect(
  null,
  mapDispatchToProps,
)(AuthenticationConsentContainer)
