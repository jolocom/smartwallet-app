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
    this.props.consumeCredentialRequest(
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjp7ImFuZCI6W3siPT0iOlt0cnVlLHRydWVdfSx7Ij09IjpbdHJ1ZSx0cnVlXX1dfX0seyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mTmFtZUNyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOnsiYW5kIjpbeyI9PSI6W3RydWUsdHJ1ZV19LHsiPT0iOlt0cnVlLHRydWVdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cDovL2xvY2FsaG9zdDo5MDAwL2F1dGhlbnRpY2F0aW9uL2szZWJrIn0sInR5cCI6ImNyZWRlbnRpYWxSZXF1ZXN0IiwiaWF0IjoxNTM5MzQ5MjgwNjY1LCJpc3MiOiJkaWQ6am9sbzpiMzEwZDI5M2FlYWM4YTVjYTY4MDIzMmI5NjkwMWZlODU5ODhmZGUyODYwYTFhNWRiNjliNDk3NjI5MjNjYzg4I2tleXMtMSJ9.lOldsvAouqiEB7wQ0wNQCsoauYJrZcsMZLZnX0Nv3vj5dTNWbH1dD5ClcLQZqmF2rosFm5AKor5KwIaC7khs0A'
    )
    // this.setState({ scanning: true })
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
