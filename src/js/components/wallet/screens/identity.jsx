import PropTypes from 'prop-types';
import React from 'react'
import {connect} from 'redux_state/utils'
import Presentation from '../presentation/identity'
import WalletError from '../../common/error'
import Loading from 'components/common/loading'

@connect({
  props: ['wallet.identity'],
  actions: [
    'wallet/identity:buyEther',
    'wallet/identity:createEthereumIdentity',
    'confirmation-dialog:openConfirmDialog',
    'wallet/identity:getWalletAddressAndBalance',
    'verification:confirmEmail',
    'verification:confirmPhone',
    'verification:startEmailVerification',
    'verification:startPhoneVerification',
    'wallet/identity:changePinValue',
    'wallet/identity:expandField',
    'wallet/identity:getIdentityInformation',
    'wallet/identity:goTo',
    'wallet/identity:setFocusedPin',
    'wallet/identity:saveToBlockchain',
    'wallet/identity:editDisplayName',
    'wallet/identity:setDisplayName',
    'wallet/identity:saveDisplayName'
  ]
})

export default class WalletIdentityScreen extends React.Component {
  static propTypes = {
    changePinValue: PropTypes.func.isRequired,
    confirmPhone: PropTypes.func.isRequired,
    expandField: PropTypes.func,
    getIdentityInformation: PropTypes.func.isRequired,
    goTo: PropTypes.func.isRequired,
    identity: PropTypes.object,
    openConfirmDialog: PropTypes.func.isRequired,
    saveToBlockchain: PropTypes.func.isRequired,
    setFocusedPin: PropTypes.func.isRequired,
    startEmailVerification: PropTypes.func.isRequired,
    startPhoneVerification: PropTypes.func.isRequired,
    buyEther: PropTypes.func.isRequired,
    createEthereumIdentity: PropTypes.func.isRequired,
    getWalletAddressAndBalance: PropTypes.func.isRequired,
    editDisplayName: PropTypes.func.isRequired,
    setDisplayName: PropTypes.func.isRequired,
    saveDisplayName: PropTypes.func.isRequired
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
      editDisplayName={this.props.editDisplayName}
      setDisplayName={this.props.setDisplayName}
      saveDisplayName={this.props.saveDisplayName}
      changePinValue={this.props.changePinValue}
      confirmDialog={(...args) => { this.handleConfirmDialog(...args) }}
      buyEther={(token) => { this.props.buyEther(token) }}
      createEthereumIdentity={this.props.createEthereumIdentity}
      goTo={this.props.goTo}
      // showUserInfo={this.props.openConfirmDialog}
      requestIdCardVerification={({title, message, rightButtonLabel, leftButtonLabel, index}) => // eslint-disable-line max-len
        this.props.openConfirmDialog(title, message, rightButtonLabel,
        () => { this.props.saveToBlockchain(index) }, leftButtonLabel)
      }
      requestVerificationCode={(...args) => this.requestVerification(...args)}
      resendVerificationCode={(...args) => this.requestVerification(...args)}
      enterVerificationCode={(...args) => this.showVerificationWindow(...args,
        ({ index }) => this.enterVerificationCode({index})
      )} />)
  }

  showVerificationWindow({title, message, attrValue, attrType, index, rightButtonLabel, leftButtonLabel}, callback) { // eslint-disable-line max-len
    return this.props.openConfirmDialog(title, message, rightButtonLabel,
      callback({attrValue, attrType, index}), leftButtonLabel)
  }

  requestVerification(...args) {
    return this.showVerificationWindow(...args, ({attrType, attrValue, index}) => { // eslint-disable-line max-len
      if (attrType === 'phone') {
        return () => this.props.startPhoneVerification({phone: attrValue, index}) // eslint-disable-line max-len
      } else if (attrType === 'email') {
        return () => this.props.startEmailVerification({email: attrValue, index}) // eslint-disable-line max-len
      }
    })
  }

  enterVerificationCode({index}) {
    return () => this.props.confirmPhone(index)
  }

  handleConfirmDialog = ({title, message, rightButtonLabel, leftButtonLabel, callback}) => { // eslint-disable-line max-len
    this.props.openConfirmDialog(title, message, rightButtonLabel,
    callback(), leftButtonLabel)
  }
}
