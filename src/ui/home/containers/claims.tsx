import React from "react"
import { CredentialOverview } from "../components/credentialOverview"
import { QRcodeScanner } from "src/ui/home/components/qrcodeScanner"
import { connect } from "react-redux"
import { accountActions, ssoActions, navigationActions } from "src/actions"
import { View } from "react-native"
import { ClaimsState } from "src/reducers/account"
import { DecoratedClaims } from "src/reducers/account/"
import { QrScanEvent } from "./types"
import { LoadingSpinner } from "../../generic"
import { routeList } from "src/routeList"

interface ConnectProps {
  setClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  parseJWT: (jwt: string) => void
  openClaimDetails: (claim: DecoratedClaims) => void
  openScanner: () => void
  did: string
  claims: ClaimsState
  loading: boolean
}

interface Props extends ConnectProps {}

interface State {
  scanning: boolean
  loading: boolean
}

export class ClaimsContainer extends React.Component<Props, State> {
  state = {
    scanning: false,
    loading: false
  }

  componentWillMount() {
    this.props.setClaimsForDid()
  }

  private onScannerStart = (): void => {}

  private onScannerCancel = (): void => {
    this.setState({ scanning: false })
    this.setState({ loading: false })
  }

  private onScannerSuccess = (e: QrScanEvent): void => {
    this.setState({ scanning: false })
    this.props.parseJWT(e.data)
    this.setState({ loading: false })
  }

  render() {
    if (this.state.scanning) {
      return (
        <QRcodeScanner
          onScannerSuccess={this.onScannerSuccess}
          onScannerCancel={this.onScannerCancel}
        />
      )
    }

    if (this.state.loading || this.props.loading || this.props.claims.loading) {
      return <LoadingSpinner />
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
    claims: state.account.claims.toJS(),
    loading: state.account.loading.toJS().loading
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    openClaimDetails: (claim: DecoratedClaims) =>
      dispatch(accountActions.openClaimDetails(claim)),
    setClaimsForDid: () => dispatch(accountActions.setClaimsForDid()),
    toggleLoading: (val: boolean) =>
      dispatch(accountActions.toggleLoading(val)),
    parseJWT: (jwt: string) => dispatch(ssoActions.parseJWT(jwt)),
    openScanner: () =>
      dispatch(
        navigationActions.navigate({ routeName: routeList.QRCodeScanner })
      )
  }
}

export const Claims = connect(
  mapStateToProps,
  mapDispatchToProps
)(ClaimsContainer)
