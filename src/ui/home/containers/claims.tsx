import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'

import { CredentialOverview } from '../components/credentialOverview'
import { LayoutWithNavigationBar } from 'src/ui/generic'
import { accountActions, ssoActions } from 'src/actions'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'

interface ConnectProps {
  setClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  parseJWT: (jwt: string) => void
  openClaimDetails: (claim: DecoratedClaims) => void
  did: string
  claims: ClaimsState
  loading: boolean
}

interface Props extends ConnectProps {}

export class ClaimsContainer extends React.Component<Props> {
  componentWillMount() {
    this.props.setClaimsForDid()
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <LayoutWithNavigationBar
          onScannerSuccess={this.props.parseJWT}
          loading={!!this.props.claims.loading}
        >
          <CredentialOverview
            did={this.props.did}
            claimsState={this.props.claims}
            loading={!!this.props.claims.loading}
            onEdit={this.props.openClaimDetails}
          />
        </LayoutWithNavigationBar>
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
