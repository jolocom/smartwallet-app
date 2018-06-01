import React from 'react'
import { ClaimOverview } from 'src/ui/home/components/claimOverview'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { View } from 'react-native'
import Immutable from 'immutable'
import { ClaimsState } from 'src/reducers/account'
import { DecoratedClaims } from 'src/reducers/account/'

interface ConnectProps {
  openClaimDetails: (claim: DecoratedClaims) => void
  getClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
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
    this.props.getClaimsForDid()
  }

// TODO: do I really need 3 func?
  private onScannerStart = () : void => {
    this.setState({ scanning: true })
  }

  private onScannerCancel = () : void => {
    this.setState({ scanning: false })
  }

  // TODO Typings on E, event is not enough
  private onScannerSuccess = (e : Event) : void => {
    this.setState({ scanning: false })
  }

  render() {
    let renderContent
    if (this.state.scanning) {
      renderContent = (
        <QRcodeScanner
          onScannerSuccess={this.onScannerSuccess}
          onScannerCancel={this.onScannerCancel}
        />
      )
    } else {
      renderContent = (
        <ClaimOverview
          claims={this.props.claims}
          openClaimDetails={ this.props.openClaimDetails }
          scanning={ this.state.scanning }
          onScannerStart={ this.onScannerStart }
         />
      )
    }

    return (
      <View style={{flex: 1}}>
        { renderContent }
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  const claims = Immutable.fromJS(state.account.claims)
  return {
    claims: claims.toJS()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    openClaimDetails: (claim: DecoratedClaims) => {
      dispatch(accountActions.openClaimDetails(claim))
    },
    getClaimsForDid: () => {
      dispatch(accountActions.getClaimsForDid())
    },
    toggleLoading: (val: boolean) => {
      dispatch(accountActions.toggleLoading(val))
    }
  }
}

export const Claims = connect(mapStateToProps, mapDispatchToProps)(ClaimsContainer)
