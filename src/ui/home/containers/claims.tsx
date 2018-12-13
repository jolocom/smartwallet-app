import React from "react"
import { CredentialOverview } from "../components/credentialOverview"
import { connect } from "react-redux"
import { accountActions, navigationActions } from "src/actions"
import { View } from "react-native"
import { ClaimsState } from "src/reducers/account"
import { DecoratedClaims } from "src/reducers/account/"
import { LoadingSpinner } from "../../generic"
import { routeList } from "src/routeList"

interface ConnectProps {
  setClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  openClaimDetails: (claim: DecoratedClaims) => void
  openScanner: () => void
  did: string
  claims: ClaimsState
  loading: boolean
}

interface Props extends ConnectProps {}

interface State {}

export class ClaimsContainer extends React.Component<Props, State> {
  componentWillMount() {
    this.props.setClaimsForDid()
  }

  render() {
    if (this.props.loading || this.props.claims.loading) {
      return <LoadingSpinner />
    }
    return (
      <View style={{ flex: 1 }}>
        <CredentialOverview
          did={this.props.did}
          claimsState={this.props.claims}
          loading={this.props.claims.loading}
          onEdit={this.props.openClaimDetails}
          onScannerStart={this.props.openScanner}
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
