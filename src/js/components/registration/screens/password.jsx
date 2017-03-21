import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'

@connect({
  props: ['registration'],
  actions: [
    'registration:goForward',
    'registration:setPassword',
    'registration:setRepeatedPassword',
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
      digit={password.digit}
      lowerCase={password.lowerCase}
      upperCase={password.upperCase}
      repeatedValue={password.repeated}
      valid={password.valid}
      passwordBarreColor={password.strength === 'weak' ? 'red': 'green'}
      strength={password.strength}
      onChangePassword={this.props.setPassword}
      onChangeRepeatedPassword={this.props.setRepeatedPassword}
      onSubmit={this.props.goForward}
    />
  }
}
