import React from 'react'
import Radium from 'radium'
import { connect } from 'redux/utils'
import Presentation from '../presentation/user-type'

@connect({
  props: ['registration'],
  actions: ['registration:goForward', 'registration:setUserType']
})
@Radium
export default class RegistrationUserTypeScreen extends React.Component {
  static propTypes = {
    registration: React.PropTypes.object.isRequired,

    goForward: React.PropTypes.func.isRequired,
    setUserType: React.PropTypes.func.isRequired
  }

  render() {
    return <Presentation
      value={this.props.registration.userType.value}
      valid={this.props.registration.userType.valid}
      onChange={this.props.setUserType}
      onSubmit={this.props.goForward}
    />
  }
}
