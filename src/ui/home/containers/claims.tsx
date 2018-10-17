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
  toggleLoading: (val: boolean) => void
  parseJWT: (jwt: string) => void
  openClaimDetails: (claim: DecoratedClaims) => void
  did: string
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
    const data = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJjcmVkZW50aWFsUmVxdWVzdCI6eyJjcmVkZW50aWFsUmVxdWlyZW1lbnRzIjpbeyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mRW1haWxDcmVkZW50aWFsIl0sImNvbnN0cmFpbnRzIjp7ImFuZCI6W3siPT0iOlt0cnVlLHRydWVdfSx7Ij09IjpbdHJ1ZSx0cnVlXX1dfX0seyJ0eXBlIjpbIkNyZWRlbnRpYWwiLCJQcm9vZk9mTmFtZUNyZWRlbnRpYWwiXSwiY29uc3RyYWludHMiOnsiYW5kIjpbeyI9PSI6W3RydWUsdHJ1ZV19LHsiPT0iOlt0cnVlLHRydWVdfV19fV0sImNhbGxiYWNrVVJMIjoiaHR0cHM6Ly9kZW1vLXNzby5qb2xvY29tLmNvbS9hdXRoZW50aWNhdGlvbi93dmtjayJ9LCJ0eXAiOiJjcmVkZW50aWFsUmVxdWVzdCIsImlhdCI6MTUzOTgxNDA0NTQ2NCwiaXNzIjoiZGlkOmpvbG86YjMxMGQyOTNhZWFjOGE1Y2E2ODAyMzJiOTY5MDFmZTg1OTg4ZmRlMjg2MGExYTVkYjY5YjQ5NzYyOTIzY2M4OCNrZXlzLTEifQ.G2c5hcpDI_5kWy_XQj2nuUwig0sybxSt9iSGqA3R26M5kGnGv_LsdairaY9TgP-j1Ocvc2YPImSRjvhabDJQbg'
    this.props.parseJWT(data)
    // this.setState({ scanning: true })
  }

  private onScannerCancel = (): void => {
    this.setState({ scanning: false })
  }

  private onScannerSuccess = (e: QrScanEvent): void => {
    this.setState({ scanning: false })
    this.props.parseJWT(e.data)
  }

  render() {
    if (this.state.scanning) {
      return <QRcodeScanner onScannerSuccess={this.onScannerSuccess} onScannerCancel={this.onScannerCancel} />
    }

    return (
      <View style={{ flex: 1 }}>
        <CredentialOverview
          did={this.props.did}
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
    did: state.account.did.toJS().did,
    claims: state.account.claims.toJS()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    openClaimDetails: (claim: DecoratedClaims) => dispatch(accountActions.openClaimDetails(claim)),
    setClaimsForDid: () => dispatch(accountActions.setClaimsForDid()),
    toggleLoading: (val: boolean) => dispatch(accountActions.toggleLoading(val)),
    parseJWT: (jwt: string) => dispatch(ssoActions.parseJWT(jwt))
  }
}

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimsContainer)
