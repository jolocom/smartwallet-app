import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:getIdentityInformation',
    'wallet/identity:goToPassportManagement',
    'wallet/identity:goToDrivingLicenceManagement',
    'wallet/identity:goToContactManagement',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog'
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
    getIdentityInformation: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  verifyEmail(message) {
    const close = this.props.closeConfirmDialog
    const cancelButtonText = 'OK'
    const confirmButtonText = 'REQUEST VERIFICATION'
    this.props.openConfirmDialog(message, cancelButtonText, close, confirmButtonText)
  }
  render() {
    const identity = this.props.wallet.identity
    return (
      <Presentation
        username={identity.username}
        contact={identity.contact}
        webId={identity.webId}
        passport={identity.passport}
        isLoaded={identity.loaded}
        goToContactManagement={this.props.goToContactManagement}
        goToPassportManagement={this.props.goToPassportManagement}
        goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
        verify={(message) => this.verifyEmail(message)}
      />
    )
  }
}
