import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/pin'

@connect({
  props: ['registration'],
  actions: [
    'registration:setPin',
    'registration:setPinConfirm',
    'registration:setPinFocused',
    'registration:submitPin'
  ]
})
export default class RegistrationPinScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    setPin: React.PropTypes.func.isRequired,
    setPinConfirm: React.PropTypes.func.isRequired,
    setPinFocused: React.PropTypes.func.isRequired,
    submitPin: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.pin.value}
      valid={this.props.registration.pin.valid}
      focused={this.props.registration.pin.focused}
      confirm={this.props.registration.pin.confirm}
      onChange={this.props.setPin}
      onChangeRequest={() => {
        this.props.setPin('')
        this.props.setPinConfirm(false)
        this.props.setPinFocused(true)
      }}
      onFocusChange={this.props.setPinFocused}
      onSubmit={this.props.submitPin}
    />
  }
}
