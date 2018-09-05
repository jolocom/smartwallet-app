import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { StateCredentialRequestSummary, StateVerificationSummary } from 'src/reducers/sso'
import { ConsentComponent } from 'src/ui/sso/components/consent'
import { ssoActions } from 'src/actions'

interface ConnectProps { }

interface Props extends ConnectProps {
  activeCredentialRequest: StateCredentialRequestSummary
  sendCredentialResponse: (creds: StateVerificationSummary[]) => void
  cancelSSO: () => void
}

interface State {

}

export class ConsentContainer extends React.Component<Props, State> {

  private handleSubmitClaims = (credentials: StateVerificationSummary[]) => {
    this.props.sendCredentialResponse(credentials)
  }

  private handleDenySubmit = () => {
    this.props.cancelSSO()
  }

  render() {
    const { request, requester, callbackURL } = this.props.activeCredentialRequest
    return (
    <ConsentComponent
      requester={ requester }
      callbackURL={ callbackURL }
      requestedCredentials={ request }
      handleSubmitClaims={ this.handleSubmitClaims }
      handleDenySubmit={ this.handleDenySubmit }
     />
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
    activeCredentialRequest: state.sso.activeCredentialRequest
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    sendCredentialResponse: (creds: StateVerificationSummary[]) => dispatch(ssoActions.sendCredentialResponse(creds)),
    cancelSSO: () => dispatch(ssoActions.cancelSSO())
  }
}

export const Consent = connect(mapStateToProps, mapDispatchToProps)(ConsentContainer)
