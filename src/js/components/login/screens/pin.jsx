import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/pin'

@connect({
  props: ['login'],
  actions: [
    'login:setPin',
    'login:resetPin',
    'login:setPinFocused',
    'login:goForward'
  ]
})
export default class ExpertLoginPinScreen extends React.Component {
  static propTypes = {
    login: React.PropTypes.object.isRequired,

    setPin: React.PropTypes.func.isRequired,
    resetPin: React.PropTypes.func.isRequired,
    setPinFocused: React.PropTypes.func.isRequired,
    goForward: React.PropTypes.func.isRequired
  }

  render() {
    const pin = this.props.login.pin
    return <Presentation
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
