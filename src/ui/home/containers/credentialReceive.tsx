import React from 'react'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { DecoratedClaims } from 'src/reducers/account'

import Immutable from 'immutable'
import { convertToDecoratedClaim, saveExternalCredentials  } from 'src/actions/account'
import { CredentialDialogComponent } from '../components/credentialDialog'
import { Block, Container } from 'src/ui/structure'
import { SignedCredential } from 'jolocom-lib/js/credentials/signedCredential/signedCredential'
import { cancelReceiving } from 'src/actions/sso'
import { renderButtonSection } from 'src/ui/structure/buttonSectionBottom'

interface ConnectProps {
  externalCredentials: SignedCredential[]
  saveExternalCredentials: () => void
  goBack: () => void
}

interface Props extends ConnectProps {}

interface State {
  toRender: DecoratedClaims
}

export class CredentialsReceiveContainer extends React.Component<Props, State> {
  state = {
    toRender: convertToDecoratedClaim(this.props.externalCredentials)[0]
  }

  render() {
    return (
      <Container style={{ padding: 0, justifyContent: 'space-between' }}>
        <Block flex={0.9}>
          <CredentialDialogComponent credentialToRender={this.state.toRender} />
        </Block>
          {renderButtonSection({
            confirmText: 'Accept',
            denyText: 'Deny',
            handleConfirm: this.props.saveExternalCredentials,
            handleDeny: this.props.goBack,
            disabled: false
          })}
      </Container>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    externalCredentials: claims.toJS().pendingExternal
  }
}

const mapDispatchToProps = (dispatch: (action: Function) => void) => {
  return {
    saveExternalCredentials: () => dispatch(saveExternalCredentials()),
    goBack: () => dispatch(cancelReceiving())
  }
}

export const CredentialReceive = connect(
  mapStateToProps,
  mapDispatchToProps
)(CredentialsReceiveContainer)