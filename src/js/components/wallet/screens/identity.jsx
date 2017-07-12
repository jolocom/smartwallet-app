import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'
import WalletError from '../presentation/error'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:getIdentityInformation',
    'wallet/identity:changePinValue',
    'wallet/identity:setFocusedPin',
    'wallet/identity:goToPassportManagement',
    'wallet/identity:goToDrivingLicenceManagement',
    'wallet/identity:goToContactManagement',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog',
    'wallet/id-card:saveToBlockchain',
    'email-confirmation:startEmailConfirmation'
  ]
})

export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
    wallet: React.PropTypes.object,
    goToPassportManagement: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    goToDrivingLicenceManagement: React.PropTypes.func.isRequired,
    goToContactManagement: React.PropTypes.func.isRequired,
    closeConfirmDialog: React.PropTypes.func.isRequired,
    openConfirmDialog: React.PropTypes.func.isRequired,
    getIdentityInformation: React.PropTypes.func.isRequired,
    configSimpleDialog: React.PropTypes.func.isRequired,
    showSimpleDialog: React.PropTypes.func.isRequired,
    startEmailConfirmation: React.PropTypes.func.isRequired,
    saveToBlockchain: React.PropTypes.func.isRequired,
    changePinValue: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  onConfirm({message, style, attrValue, rightButtonText, leftButtonText}) {
    this.props.openConfirmDialog(
      message,
      rightButtonText,
      this.props.closeConfirmDialog(),
      leftButtonText,
      style
    )
  }

  render() {
    const {
      username,
      contact,
      webId,
      passports,
      idCards,
      loaded,
      error
    } = this.props.wallet.identity
    const {emails, phones} = contact
    if (error) {
      return (<WalletError
        message={
          '...oops something went wrong! We were not able to load your data.'
        }
        buttonLabel="RETRY"
        onClick={() => this.render()} />)
    }

    return (<Presentation
      username={username}
      emails={emails}
      phones={phones}
      webId={webId}
      passports={passports}
      idCards={idCards}
      isLoaded={loaded}
      isError={error}
      setFocusedPin={this.props.setFocusedPin}
      changePinValue={this.props.changePinValue}
      goToContactManagement={this.props.goToContactManagement}
      goToPassportManagement={this.props.goToPassportManagement}
      goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
      saveToBlockchain={this.props.saveToBlockchain}
      onConfirm={
        ({message, style, attrValue, rightButtonText, leftButtonText}) =>
        this.onConfirm({
          message,
          style,
          attrValue,
          rightButtonText,
          leftButtonText
        })
      }
      onVerify={({message, buttonText, style, attrValue}) => {
        this.props.configSimpleDialog(() => {
          this.props.startEmailConfirmation({email: attrValue})
        }, message, buttonText, style)
        this.props.showSimpleDialog()
      }}
      showUserInfo={(...args) => {
        this.props.configSimpleDialog(...args)
        this.props.showSimpleDialog()
      }} />)
  }
}
