import React from 'react'
import { connect } from 'redux/utils'
import Presentation from '../presentation/identifier'

@connect({
  props: ['registration'],
  actions: ['registration:checkEmail',
    'registration:setEmail',
    'registration:setInviteCode']
})
export default class RegistrationIdentifierScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,
    location: React.PropTypes.object.isRequired,

    checkEmail: React.PropTypes.func.isRequired,
    setEmail: React.PropTypes.func.isRequired,
    setInviteCode: React.PropTypes.func.isRequired
  }

  componentDidMount() {
    const inviteCode = this.props.location.query.ic
    if (inviteCode) {
      this.props.setInviteCode(inviteCode)
    }
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
