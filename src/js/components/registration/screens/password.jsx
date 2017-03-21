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
    togglePasswordRepeatedValue: React.PropTypes.func.isRequired,
    togglePasswordValue: React.PropTypes.func.isRequired,
  }

  render() {
    const password = this.props.registration.password
 
    return <Presentation
      value={password.value}
      repeatedValueState={password.value.length < 7}
      repeatedValue={password.repeated}
      valid={password.valid}
      passwordBarreColor={password.strength === 'weak' ? 'red': 'green'}
      showFirstBare={password.value.length > 2? 'visible': 'hidden'}
      showSecondBare={password.value.length > 4? 'visible': 'hidden'}
      showThirdBare={password.value.length > 7? 'visible': 'hidden'}
      showRepeatedValueFirstBare={password.repeated.length > 2? 'visible': 'hidden'}
      showRepeatedValueSecondBare={password.repeated.length > 4? 'visible': 'hidden'}
      showRepeatedValueThirdBare={password.repeated.length > 7? 'visible': 'hidden'}
      strength={password.strength}
      onChangePassword={this.props.setPassword}
      onChangeRepeatedPassword={this.props.setRepeatedPassword}
      onSubmit={this.props.goForward}
    />
  }
}
