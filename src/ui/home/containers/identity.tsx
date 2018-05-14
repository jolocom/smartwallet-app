import React from 'react'
import { ClaimOverviewComponent } from 'src/ui/home/components/claimOverview'
import { ClaimDetails } from 'src/ui/home/components/claimDetails'
import { QRcodeScanner } from 'src/ui/home/components/qrcodeScanner'
import { connect } from 'react-redux'
import { AnyAction } from 'redux'
import { RootState } from 'src/reducers/'
import { View } from 'react-native'

interface ConnectProps {
}

interface Props extends ConnectProps {}

interface State {
  scanning: boolean,
  showClaimDetails: boolean
  typeClaimDetails: string
}

export class IdentityContainer extends React.Component<Props, State> {

  state = {
    scanning: false,
    showClaimDetails: false,
    typeClaimDetails: ''
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
    } else if (this.state.showClaimDetails) {
      renderContent = (
        <ClaimDetails
          typeClaimDetails={ this.state.typeClaimDetails }
          toggleClaimDetails={ this.toggleClaimDetails }
        />
      )
    } else {
      renderContent = (
        <ClaimOverviewComponent
          claims={[{claimType: 'name'}, {claimType: 'email'}]}
          openClaimDetails={ this.openClaimDetails }
          scanning={ this.state.scanning }
          onScannerStart={ this.onScannerStart }
         />
      )
    }

    return (
      <View>
        { renderContent }
      </View>
    )
  }
}

const mapStateToProps = (state: RootState) => {
  return {
  }
}

const mapDispatchToProps = (dispatch: (action: AnyAction) => void) => {
  return {
  }
}

export const Identity = connect(mapStateToProps, mapDispatchToProps)(IdentityContainer)
