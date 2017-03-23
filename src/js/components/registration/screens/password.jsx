import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/password'
import { isPasswordStrongEnough, passwordStrengthErrorMessage,
          passwordsMatchErrorMessage } from '../../../lib/password-util'

@connect({
  props: ['registration'],
  actions: [
    'registration:goForward',
    'registration:setPassword',
    'registration:setRepeatedPassword'
  ]
})

export default class RegistrationPasswordScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    goForward: React.PropTypes.func.isRequired,
    setPassword: React.PropTypes.func.isRequired,
    setRepeatedPassword: React.PropTypes.func.isRequired
  }

  render() {
    const password = this.props.registration.password
    return <Presentation
      value={password.value}
      hasDigit={password.hasDigit}
      hasLowerCase={password.hasLowerCase}
      hasUpperCase={password.hasUpperCase}
      repeatedValue={password.repeated}
      valid={password.valid}
      strength={password.strength}
      onChangePassword={this.props.setPassword}
      onChangeRepeatedPassword={
        this.props.setRepeatedPassword
      }
      onSubmit={this.props.goForward}
      repeatedValueState={
        !isPasswordStrongEnough(password.value)
      }
      passwordStrengthErrorMessage={
        passwordStrengthErrorMessage(password)
      }
      passwordsMatchErrorMessage={
        passwordsMatchErrorMessage(password.value, password.repeated)
      }
      />
  }
}
