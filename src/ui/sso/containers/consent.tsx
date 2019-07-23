import React from 'react'
import { connect } from 'react-redux'
import { StateVerificationSummary } from 'src/reducers/sso'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'
import { ThunkDispatch } from '../../../store'
import { withErrorHandling, withLoading } from '../../../actions/modifiers'
import { showErrorScreen } from '../../../actions/generic'
import { NavigationParams } from 'react-navigation'

interface Props
  extends ReturnType<typeof mapDispatchToProps>,
    ReturnType<typeof mapStateToProps> {
  navigation: { state: { params: NavigationParams } }
}

interface State {}

export class ConsentContainer extends React.Component<Props, State> {
  private handleSubmitClaims = (credentials: StateVerificationSummary[]) => {
    this.props.sendCredentialResponse(
      credentials,
      this.props.navigation.state.params.isDeepLinkInteraction,
    )
  }

  private handleDenySubmit = () => {
    this.props.cancelSSO()
  }

  render() {
    const {
      availableCredentials,
      requester,
      callbackURL,
    } = this.props.activeCredentialRequest
    return (
      <ConsentComponent
        requester={requester}
        callbackURL={callbackURL}
        did={this.props.currentDid}
        availableCredentials={availableCredentials}
        handleSubmitClaims={this.handleSubmitClaims}
        handleDenySubmit={this.handleDenySubmit}
      />
    )
  }
}

const mapStateToProps = (state: any) => ({
  activeCredentialRequest: state.sso.activeCredentialRequest,
  currentDid: state.account.did.did,
})

const mapDispatchToProps = (dispatch: ThunkDispatch) => ({
  sendCredentialResponse: (
    credentials: StateVerificationSummary[],
    isDeepLinkInteraction: boolean,
  ) =>
    dispatch(
      withLoading(
        withErrorHandling(showErrorScreen)(
          ssoActions.sendCredentialResponse(credentials, isDeepLinkInteraction),
        ),
      ),
    ),
  cancelSSO: () => dispatch(ssoActions.cancelSSO),
})

export const Consent = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ConsentContainer)
