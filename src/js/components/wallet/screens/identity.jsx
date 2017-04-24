import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'
import WalletError from '../presentation/error'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:getIdentityInformation',
    'wallet/identity:goToPassportManagement',
    'wallet/identity:goToDrivingLicenceManagement',
    'wallet/identity:goToContactManagement',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog'
  ]
})

export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.object,
    goToPassportManagement: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    closeConfirmDialog: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    getIdentityInformation: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  confirm(message, style) {
    this.props.openConfirmDialog(
      message,
      'REQUEST VERIFICATION',
      this.props.closeConfirmDialog,
      'OK',
      style
    )
  }

  render() {
    const identity = this.props.wallet.identity
    if (identity.error) {
      return (
        <WalletError
          message="...oops something went wrong!
          We were not able to load your data."
          buttonLabel="RETRY"
          onClick={this.props.getIdentityInformation} />

      )
    }
    return (
      <Presentation
        username={identity.username}
        contact={identity.contact}
        webId={identity.webId}
        passport={identity.passport}
        isLoaded={identity.loaded}
        isError={identity.error}
        goToContactManagement={this.props.goToContactManagement}
        goToPassportManagement={this.props.goToPassportManagement}
        goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
        confirm={(message, style) => this.confirm(message, style)}
        verify={(message, buttonText, style) => {
          this.props.configSimpleDialog(message, buttonText, style)
          this.props.showSimpleDialog()
        }}
      />
    )
  }
}
