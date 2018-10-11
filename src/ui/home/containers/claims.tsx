import React from 'react'
import { CredentialOverview } from '../components/credentialOverview'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { accountActions, ssoActions } from 'src/actions'
import { View } from 'react-native'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'
import { QrScanEvent } from './types'

interface ConnectProps {
  setClaimsForDid: () => void
  openClaimDetails: (claim: DecoratedClaims) => void
  consumeCredentialRequest: (jwt: string) => void
  claims: ClaimsState
}

interface Props extends ConnectProps {}

interface State {
  scanning: boolean
}

export class ClaimsContainer extends React.Component<Props, State> {
  state = {
    scanning: false
  }

  componentWillMount() {
    this.props.setClaimsForDid()
  }

  private onScannerStart = (): void => {
    this.setState({ scanning: true })
  }

  private onScannerCancel = (): void => {
    this.setState({ scanning: false })
  }

  private onScannerSuccess = (e: QrScanEvent): void => {
    this.setState({ scanning: false })
    this.props.consumeCredentialRequest(e.data)
  }

  render() {
    if (this.state.scanning) {
      return <QRcodeScanner onScannerSuccess={this.onScannerSuccess} onScannerCancel={this.onScannerCancel} />
    }

    return (
      <View style={{ flex: 1 }}>
        <CredentialOverview
          claimsState={this.props.claims}
          loading={this.props.claims.loading}
          onEdit={this.props.openClaimDetails}
          scanning={this.state.scanning}
          onScannerStart={this.onScannerStart}
        />
      </View>
    )
  }
}

// TODO nicer pattern for accessing state, perhaps immer or something easier to Type
const mapStateToProps = (state: any) => {
  return {
    claims: state.account.claims.toJS()
  }
}

const mapDispatchToProps = (dispatch: Function) => ({
  openClaimDetails: (claim: DecoratedClaims) => dispatch(accountActions.openClaimDetails(claim)),
  setClaimsForDid: () => dispatch(accountActions.setClaimsForDid()),
  consumeCredentialRequest: (jwt: string) => dispatch(ssoActions.consumeCredentialRequest(jwt))
})

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimsContainer)
