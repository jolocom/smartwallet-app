import React from 'react'
import { ClaimOverview } from 'src/ui/home/components/claimOverview'
import { ClaimDetails } from 'src/ui/home/components/claimDetails'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions, navigationActions } from 'src/actions'
import { View } from 'react-native'
import Immutable from 'immutable'

interface ConnectProps {
  openClaimDetails: () => void
  getClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  claims: any
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
    // this.props.getClaimsForDid()
  }

  private openClaimDetails = (selectedType : string) : void => {
    this.setState({
      typeClaimDetails: selectedType
    })
    this.toggleClaimDetails()
  }

  private toggleClaimDetails = () : void => {
    this.setState({
      showClaimDetails: !this.state.showClaimDetails
    })
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
    claims: claims.toObject()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    openClaimDetails: () => {
      dispatch(navigationActions.navigate({routeName: 'ClaimDetails'}))
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
