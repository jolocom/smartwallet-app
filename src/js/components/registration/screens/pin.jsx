import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/pin'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setHumanName']
})
export default class RegistrationPinScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    setPin: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.pin.value}
      valid={this.props.registration.pin.valid}
      onChange={this.props.setPin}
      onSubmit={this.props.goForward}
    />
  }
}
