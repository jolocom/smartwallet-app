import React from 'react'
import {connect} from 'redux/utils'
import Presentation from '../presentation/identity'
import WalletError from '../../common/error'
import Loading from 'components/common/loading'

@connect({
  props: ['wallet.identity'],
  actions: [
    'wallet/identity:buyEther',
    'wallet/identity:createEthereumIdentity',
    'confirmation-dialog:openConfirmDialog',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'wallet/identity:changePinValue',
    'wallet/identity:expandField',
    'wallet/identity:getIdentityInformation',
    'wallet/identity:goTo',
    'wallet/identity:setFocusedPin',
    'wallet/identity:saveToBlockchain'
  ]
})

export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    changePinValue: React.PropTypes.func.isRequired,
    confirmEmail: React.PropTypes.func.isRequired,
    confirmPhone: React.PropTypes.func.isRequired,
    expandField: React.PropTypes.func,
    getIdentityInformation: React.PropTypes.func.isRequired,
    goTo: React.PropTypes.func.isRequired,
    identity: React.PropTypes.object,
    openConfirmDialog: React.PropTypes.func.isRequired,
    resendVerificationLink: React.PropTypes.func,
    resendVerificationSms: React.PropTypes.func,
    saveToBlockchain: React.PropTypes.func.isRequired,
    setFocusedPin: React.PropTypes.func.isRequired,
    startEmailVerification: React.PropTypes.func.isRequired,
    startPhoneVerification: React.PropTypes.func.isRequired,
    buyEther: React.PropTypes.func.isRequired,
    createEthereumIdentity: React.PropTypes.func.isRequired
  }

  componentWillMount() {
    this.props.getIdentityInformation()
  }

  render() {
    if (this.props.identity.error) {
      return (<WalletError
        message={'...oops something went wrong! We were not able to load ' +
        'your data.'}
        buttonLabel="RETRY"
        onClick={() => this.render()} />)
    }

    if (!this.props.identity.loaded) {
      return <Loading />
    }

    return (<Presentation
      identity={this.props.identity}
      expandField={this.props.expandField}
      setFocusedPin={this.props.setFocusedPin}
      changePinValue={this.props.changePinValue}
      confirmDialog={(...args) => {this.handleConfirmDialog(...args)} }
      buyEther={(token) => {this.props.buyEther(token)} }
      createEthereumIdentity={this.props.createEthereumIdentity}
      goTo={this.props.goTo}
      showUserInfo={this.props.openConfirmDialog}
      requestIdCardVerification={({title, message, rightButtonLabel, leftButtonLabel, index}) => // eslint-disable-line max-len
        this.props.openConfirmDialog(title, message, rightButtonLabel,
        () => { this.props.saveToBlockchain(index) }, leftButtonLabel)
      }
      requestVerificationCode={(...args) => this.requestVerification(...args)}
      resendVerificationCode={(...args) => this.showVerificationWindow(...args,
        (...params) => this.resendVerificationCode(...params)
      )}
      enterVerificationCode={(...args) => this.showVerificationWindow(...args,
        (...params) => this.enterVerificationCode(...params)
      )} />)
  }

  showVerificationWindow({title, message, attrValue, attrType, index, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(title, message, rightButtonLabel,
      callback({attrValue, attrType, index}), leftButtonLabel)
  }

  requestVerification(...args) {
    return this.showVerificationWindow(args[0], () => {
      return () => this.showVerificationWindow(args[1], ({attrType, attrValue, index}) => { // eslint-disable-line max-len
        if (attrType === 'phone') {
          return () => this.props.startPhoneVerification({phone: attrValue, index}) // eslint-disable-line max-len
        } else if (attrType === 'email') {
          return () => this.props.startEmailVerification({email: attrValue, index}) // eslint-disable-line max-len
        }
      })
    })
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

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback(), leftButtonLabel)
  }
}
