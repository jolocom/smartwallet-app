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
    'simple-dialog:configSimpleDialog',
    'email-confirmation:startEmailVerification',
    'email-confirmation:startPhoneVerification'
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
    showSimpleDialog: React.PropTypes.func.isRequired,
    startEmailVerification: React.PropTypes.func.isRequired,
    startPhoneVerification: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
    // console.log(this.props.getIdentityInformation())
  }

  onConfirm(message, style) {
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
          message={
            '...oops something went wrong!' +
            'We were not able to load your data.'
          }
          buttonLabel="RETRY"
          onClick={() => this.render()} />

      )
    }

    return (
      <Presentation
        username={identity.username}
        contact={identity.contact}
        webId={identity.webId}
        passports={identity.passports}
        idCards={identity.idCards}
        isLoaded={identity.loaded}
        isError={identity.error}
        goToContactManagement={this.props.goToContactManagement}
        goToPassportManagement={this.props.goToPassportManagement}
        goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
        onConfirm={
          ({message, style, attrValue}) => this.onConfirm(message, style)}
        onVerify={({message, buttonText, style, attrType, attrValue}) => {
          this.props.configSimpleDialog(() => {
            if (attrType === 'email') {
              this.props.startEmailVerification({email: attrValue})
            } else if (attrType === 'phone') {
              this.props.startPhoneVerification({email: attrValue})
            }
          }, message, buttonText, style)
          this.props.showSimpleDialog()
        }}
      />
    )
  }
}
