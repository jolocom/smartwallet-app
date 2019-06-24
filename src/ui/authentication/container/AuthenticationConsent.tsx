import React from 'react'
import { connect } from 'react-redux'
import { AuthenticationConsentComponent } from '../components/AuthenticationConsent'
import { RootState } from 'src/reducers'
import { cancelSSO } from 'src/actions/sso'
import { sendAuthenticationResponse } from 'src/actions/sso/authenticationRequest'
import { ThunkDispatch } from '../../../store'
import { withErrorHandling } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'
import {NavigationParams} from 'react-navigation'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: { state: { params: NavigationParams } }
}

interface State {}

export class AuthenticationConsentContainer extends React.Component<
  Props,
  State
> {
  render() {
    const {isDeepLinkInteraction} = this.props.navigation.state.params
    return (
      <AuthenticationConsentComponent
        activeAuthenticationRequest={this.props.activeAuthenticationRequest}
        confirmAuthenticationRequest={() => this.props.confirmAuthenticationRequest(isDeepLinkInteraction)}
        cancelAuthenticationRequest={this.props.cancelAuthenticationRequest}
      />
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  activeAuthenticationRequest: state.sso.activeAuthenticationRequest,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  confirmAuthenticationRequest: (isDeepLinkInteraction: boolean) =>
    dispatch(withErrorHandling(showErrorScreen)(sendAuthenticationResponse(isDeepLinkInteraction))),
  cancelAuthenticationRequest: () => dispatch(cancelSSO),
})

export const AuthenticationConsent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(AuthenticationConsentContainer)
