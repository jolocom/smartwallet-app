import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/identifier'

@connect({
  props: ['registration'],
  actions: ['registration:checkEmail', 'registration:setEmail']
})
export default class RegistrationIdentifierScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    checkEmail: React.PropTypes.func.isRequired,
    setEmail: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.email.value}
      errorMsg={this.props.registration.email.errorMsg}
      username={this.props.registration.username.value}
      onChange={this.props.setEmail}
      onSubmit={this.props.checkEmail}
    />
  }
}
