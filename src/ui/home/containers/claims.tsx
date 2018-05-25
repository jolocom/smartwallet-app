import React from 'react'
import { ClaimOverview } from 'src/ui/home/components/claimOverview'
import { ClaimDetails } from 'src/ui/home/components/claimDetails'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { RootState } from 'src/reducers/'
import { accountActions } from 'src/actions'
import { View } from 'react-native'

interface ConnectProps {
  getClaimsForDid: () => void
  toggleLoading: (val: boolean) => void
  claims: any
}

interface Props extends ConnectProps {}

interface State {
  scanning: boolean
  showClaimDetails: boolean
  typeClaimDetails: string
}

export class ClaimsContainer extends React.Component<Props, State> {

  state = {
    scanning: false,
    showClaimDetails: false,
    typeClaimDetails: ''
  }

  componentWillMount() {
    this.props.getClaimsForDid()
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
    } else if(this.state.showClaimDetails) {
      renderContent = (
        <ClaimDetails
          typeClaimDetails={ this.state.typeClaimDetails }
          toggleClaimDetails={ this.toggleClaimDetails }
        />
      )
    } else {
      renderContent = (
        <ClaimOverview
          claims={this.props.claims}
          openClaimDetails={ this.openClaimDetails }
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
  return {
    claims: state.account.claims.toObject()
  }
}

const mapDispatchToProps = (dispatch: Function) => {
  return {
    getClaimsForDid: () => {
      dispatch(accountActions.getClaimsForDid())
    },
    toggleLoading: (val: boolean) => {
      dispatch(accountActions.toggleLoading(val))
    }
  }
}

export const Claims = connect(mapStateToProps, mapDispatchToProps)(ClaimsContainer)
