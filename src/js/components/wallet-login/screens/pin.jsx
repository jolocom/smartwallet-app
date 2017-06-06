import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/pin'

@connect({
  props: ['walletLogin'],
  actions: [
    'wallet-login:setPin',
    'wallet-login:resetPin',
    'wallet-login:setPinFocused',
    'wallet-login:goForward'
  ]
})
export default class ExpertLoginPinScreen extends React.Component {
  static propTypes = {
    walletLogin: React.PropTypes.object.isRequired,
    setPin: React.PropTypes.func.isRequired,
    resetPin: React.PropTypes.func.isRequired,
    setPinFocused: React.PropTypes.func.isRequired,
    goForward: React.PropTypes.func.isRequired
  }

  render() {
    const pin = this.props.walletLogin.pin
    console.log('blaat', this.props.walletLogin)
    return <Presentation
      userType={this.props.walletLogin.userType.value}
      value={pin.value}
      valid={pin.valid}
      focused={pin.focused}
      canSubmit={pin.valid}
      onChange={this.props.setPin}
      onReset={this.props.resetPin}
      onFocusChange={this.props.setPinFocused}
      onSubmit={this.props.goForward}
      failed={pin.failed}
    />
  }
}
