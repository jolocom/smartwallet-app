import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setPassword', 'registration:setRepeatedPassword']
})

export default class RegistrationPasswordScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired,
    setRepeatedPassword: React.PropTypes.func.isRequired,
  }

  render() {
    return <Presentation
      value={this.props.registration.password.value}
      repeatedValue={this.props.registration.password.repeated}
      valid={this.props.registration.password.valid}
      onChangePassword={this.props.setPassword}
      onChangeRepeatedPassword={this.props.setRepeatedPassword}
      onSubmit={this.props.goForward}
    />
  }
}
