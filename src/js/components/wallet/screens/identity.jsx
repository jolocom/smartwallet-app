import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'
import WalletError from '../../common/error'

@connect({
  props: ['wallet'],
  actions: [
    'wallet/identity:getIdentityInformation',
    'wallet/identity:changeSmsCodeValue',
    'wallet/identity:buyEther',
    'wallet/identity:changePinValue',
    'wallet/identity:setFocusedPin',
    'wallet/identity:goToPassportManagement',
    'wallet/identity:goToDrivingLicenceManagement',
    'wallet/identity:expandField',
    'wallet/identity:goToContactManagement',
    'confirmation-dialog:openConfirmDialog',
    'confirmation-dialog:closeConfirmDialog',
    'simple-dialog:showSimpleDialog',
    'simple-dialog:configSimpleDialog',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'wallet/identity:saveToBlockchain'
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
    startPhoneVerification: React.PropTypes.func.isRequired,
    startEmailVerification: React.PropTypes.func.isRequired,
    confirmEmail: React.PropTypes.func.isRequired,
    confirmPhone: React.PropTypes.func.isRequired,
    resendVerificationLink: React.PropTypes.func,
    expandField: React.PropTypes.func,
    resendVerificationSms: React.PropTypes.func,
    changePinValue: React.PropTypes.func.isRequired,
    changeSmsCodeValue: React.PropTypes.func.isRequired,
    saveToBlockchain: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  ethConnectInfo() {
    console.log('wohoooooo')
  }

  render() {
    const { username, contact, webId, passports, idCards, loaded, error,
      expandedFields } = this.props.wallet.identity
    if (error) {
      return (<WalletError
        message="...oops something went wrong! We were not able to load your data." // eslint-disable-line max-len
        buttonLabel="RETRY"
        onClick={() => this.render()} />)
    }
    const {emails, phones} = contact

    return (<Presentation
      username={username}
      expandedFields={expandedFields}
      emails={emails}
      phones={phones}
      webId={webId}
      passports={passports}
      idCards={idCards}
      isLoaded={loaded}
      expandField={this.props.expandField}
      isError={error}
      pinFocused={contact.isCodeInputFieldFocused}
      setFocusedPin={this.props.setFocusedPin}
      changePinValue={this.props.changePinValue}
      ethConnectInfo={(...args) => {this.ethConnectInfo(...args)} }
      buyEther={(token) => {this.props.buyEther(token)} }
      goToContactManagement={this.props.goToContactManagement}
      goToPassportManagement={this.props.goToPassportManagement}
      goToDrivingLicenceManagement={this.props.goToDrivingLicenceManagement}
      requestIdCardVerification={
        ({title, message, rightButtonLabel, leftButtonLabel, index}) =>
          this.props.openConfirmDialog(
            title,
            message,
            rightButtonLabel,
            () => { this.props.saveToBlockchain(0) },
            leftButtonLabel
          )
        }
      requestVerificationCode={(args, params) => this.showVerificationWindow(args, () => { // eslint-disable-line max-len
        return () => this.showVerificationWindow(params,
          (callbackArgs) => this.requestVerificationCode(callbackArgs))
      })}
      resendVerificationCode={(...args) => this.showVerificationWindow(...args,
        (...params) => this.resendVerificationCode(...params)
      )}
      enterVerificationCode={(...args) => this.showVerificationWindow(...args,
        (...params) => this.enterVerificationCode(...params)
      )}
      onVerify={({title, message, buttonText, style, attrValue}) => {
        this.props.configSimpleDialog(() => {
          this.props.startEmailVerification({email: attrValue})
        }, title, message, buttonText, style)
        this.props.showSimpleDialog()
      }}
      onConfirm={(...args) => { this.onConfirm(...args) }}
      showUserInfo={(...args) => {
        this.props.openConfirmDialog(...args)
        // this.props.showSimpleDialog()
      }} />)
  }

  onConfirm(args, params) {
    return this.showVerificationWindow(args, () => {
      return () => this.showVerificationWindow(params,
      (callbackArgs) => this.requestVerificationCode(callbackArgs))
    })
  }

  requestVerificationCode({attrType, attrValue, index}) {
    if (attrType === 'phone') {
      return () => this.props.startPhoneVerification({phone: attrValue, index})
    } else if (attrType === 'email') {
      return () => this.props.startEmailVerification({email: attrValue, index})
    }
  }

  resendVerificationCode({attrType, attrValue, index}) {
    if (attrType === 'phone') {
      return () => this.props.resendVerificationSms({phone: attrValue, index})
    } else if (attrType === 'email') {
      return () => this.props.resendVerificationLink({email: attrValue, index})
    }
  }

  enterVerificationCode({attrType, attrValue, index}) {
    if (attrType === 'phone') {
      return () => this.props.confirmPhone(index)
    } else if (attrType === 'email') {
      return () => this.props.confirmEmail({email: attrValue})
    }
  }

  showVerificationWindow({title, message, attrValue, attrType, index, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(
      title,
      message,
      rightButtonLabel,
      callback({attrValue, attrType, index}),
      leftButtonLabel
    )
  }

  ethConnectInfo = ({title, message}) => {
    // console.log(title, message)
    this.props.configSimpleDialog(title, message, 'OK', {}, false)
    this.props.showSimpleDialog()
  }
}
