import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'

@connect({
  props: ['registration'],
  actions: [
    'registration:goForward',
    'registration:setPassword',
    'registration:togglePasswordValue',
    'registration:setRepeatedPassword',
    'registration:togglePasswordRepeatedValue',
  ]
})

export default class RegistrationPasswordScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired,
    setRepeatedPassword: React.PropTypes.func.isRequired,
  }

  render() {
    const password = this.props.registration.password
    return <Presentation
      value={password.value}
      repeatedValue={password.repeated}
      valid={password.valid}
      visibleValue={password.visibleValue ? 'input': 'password'}
      visibleRepeatedValue={password.visibleRepeatedValue ? 'input': 'password'}
      onTogglePasswordValue={this.props.togglePasswordValue}
      onToggleRepeatedPasswordValue={this.props.toggleRepeatedPasswordValue}
      onChangePassword={this.props.setPassword}
      onChangeRepeatedPassword={this.props.setRepeatedPassword}
      onSubmit={this.props.goForward}
    />
  }
}
