import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setPassword']
})

export default class RegistrationPasswordScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.password.value}
      valid={this.props.registration.password.valid}
      onChange={this.props.setPassword}
      onSubmit={this.props.goForward}
    />
  }
}
