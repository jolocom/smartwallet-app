import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { DecoratedClaims } from 'src/reducers/account'

import Immutable from 'immutable'
import { saveClaim } from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'

interface ConnectProps {
  credentialToRender: DecoratedClaims
  saveCredentials: () => void
}

interface Props extends ConnectProps {}

interface State {}

export class CredentialDialogContainer extends React.Component<Props, State> {
  state = {}

  render() {
    return <CredentialDialogComponent credentialToRender={this.props.credentialToRender}/>
  }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    credentialToRender: claims.toJS().selected
  }
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {
    saveCredentials: () => dispatch(saveClaim())
  }
}

export const CredentialDialog = connect(
  mapStateToProps,
  mapDispatchToProps
)(CredentialDialogContainer)
